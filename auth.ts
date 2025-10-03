import { db } from "@/lib/db"; // Make sure you import your prisma client
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { getUserById } from "./modules/auth/actions";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (!user || !account) return false;

      // Check if user already exists
      let existingUser = await db.user.findUnique({
        where: { email: user.email! },
      });

      // If user does not exist, create them
      if (!existingUser) {
        existingUser = await db.user.create({
          data: {
            email: user.email!,
            name: user.name,
            image: user.image,
          },
        });
      }

      // Check if account already exists
      const existingAccount = await db.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
        },
      });

      // If account does not exist, create it
      if (!existingAccount) {
        await db.account.create({
          data: {
            userId: existingUser.id,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            refreshToken: account.refresh_token,
            accessToken: account.access_token,
            expiresAt: account.expires_at,
            tokenType: account.token_type,
            scope: account.scope,
            idToken: account.id_token,
            // @ts-ignore
            sessionState: account.session_state,
          },
        });
      }

      return true;
    },

    async jwt({ token}) {
     if(!token.sub) return token;

     const existingUser = await getUserById(token.sub);
     if(!existingUser)  return token

     token.name = existingUser.name;
     token.email = existingUser.email;
     token.role = existingUser.role;

     return token;

    },

    async session({ session, token }) {
      if(token.sub && session.user){
        session.user.id = token.sub
        session.user.role = token.role
      }

      return session
    },
  },
  ...authConfig, // keep your custom config if needed
});
