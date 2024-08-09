"use client"
import React from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { signOut } from 'next-auth/react';
import Button from 'next/'
const SignInButton = () => {

    const {data:session} = useSession();
    const logout=()=>{
        // window.location.reload()
        signOut();

    }

    if (session && session.user){

        console.log(session)
        return (
            <div className="flex gap-4 ml-auto">
            
            <button

className="flex gap-4 ml-auto text-red-400 bg-white py-1 px-2"
onClick={logout}
>
              Sign Out
            </button>
         
          </div>
        );
    }

  return (
    <div className="flex gap-4 ml-auto items-center">
    <Link
      href={"/api/auth/signin"}
      className="flex gap-4 ml-auto text-blue-400 bg-white py-1 px-2"
    >
      Sign In
    </Link>
  
  </div>
  )
}

export default SignInButton
