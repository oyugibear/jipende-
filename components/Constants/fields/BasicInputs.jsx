'use client'
import React from 'react'

export default function BasicInputs({label, value, setValue}) {
  return (
    <div className='flex flex-col'>
     <label className='text-xs text-slate-800 font-thin' htmlFor='name'>{label}</label>
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} name="name" id="name" className='p-2 border w-full rounded-sm' />
    </div>
  )
}
