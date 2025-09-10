import { db } from "@/lib/db";
import Image from "next/image";

export default async function Home() {

  return (
   <div className="flex flex-col items-center justify-center h-screen mask-b-from-gray-100">
    <button>
      GET started
    </button>
   </div>
  );
}
