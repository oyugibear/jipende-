"use client"

import Link from 'next/link'
import React, { useContext, useState } from 'react'
import { loginUser } from "@/services/users"
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { UserContext } from '@/context';
export default function page() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { updateUser } = useContext(UserContext)


  const router = useRouter()

  const handleSubmit = async (e ) => {
    e.preventDefault()
    const credentials = {
      email: email,
      password: password,
    }

    try {
      const  data  = await loginUser(credentials)
      if (data && !data.error) {
        updateUser(data.user);
        router.push("/");
      } else {
        
        throw new Error(data.error || "Invalid response format from server"); 
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='w-full flex flex-col py-12  px-4 items-center justify-center'>
        <div className='flex flex-col items-center justify-center w-full max-w-[470px]'>
            <h1 className='text-md:3xl text-xl font-semibold'>Sign In</h1>

            <form onSubmit={(e) => handleSubmit(e)} className='my-8 w-full'>
                <div className='flex flex-col w-full items-start'>
                  <label className='text-xs text-[#848484] font-thin'>Email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className='p-2 border w-full rounded-sm mt-1'/>
                </div>
                <div className='flex flex-col w-full items-start mt-4'>
                  <label className='text-xs text-[#848484] font-thin'>Password</label>
                  <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className='p-2 border w-full rounded-sm mt-1'/>
                </div>

                <button type='submit' className='w-full bg-[#FFD02A] text-black uppercase flex justify-center font-bold p-2 mt-8'>
                  Sign in
                </button>
            </form>

            <div className='flex flex-col items-center justify-center gap-6'>
              <Link href=''>
                <p className='text-sm underline'>Forgot Password?</p>
              </Link>
              <Link href='/auth/register'>
                <p className='text-sm '>New To Jipende, <span className='font-bold underline'>Register Now</span></p>
              </Link>
            </div>
        </div>
    </div>
  )
}
