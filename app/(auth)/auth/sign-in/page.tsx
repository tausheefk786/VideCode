import React from 'react'
import Image from "next/image";
import SignInFormClient from '@/modules/auth/components/sign-in-form-client';



const Page=()=> {

    return (
        <>
        <Image src={"/login.svg"} alt ='Login image' height ={300} width ={300} 
        className='flex m-6 object-cover'/>
        <SignInFormClient/>
        </>
        
    )
}

export default Page;
