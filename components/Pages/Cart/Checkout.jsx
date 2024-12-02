"use client"

import React, { useState } from 'react'
import CheckoutLabel from './CheckoutLabel'
import axios from 'axios'
import { API_URL } from '@/config/api.config'
import { message } from 'antd'
import { useUser } from '@/context'
import { reset } from '@/app/GlobalRedux/Features/cart/CartSlice'; 
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'

export default function Checkout({cart}) {

    const [paymnetOptionClicked, setPaymentOptionClicked] = useState('Mpesa')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [cardName, setCardName] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [expiryDate, setExpiryDate] = useState('')
    const [cvv, setCvv] = useState('')
    // console.log(cart)

    let tax = cart.totalAmount * 0.16
    const { user } = useUser()

    const router = useRouter()
    const dispatch = useDispatch()

    const handleClick = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post(`${API_URL}/payment/add`, {
                services: cart.products,
                total: cart.totalAmount,
                vat: tax,
                paymentType: paymnetOptionClicked,
                phoneNumber: phoneNumber || null,
                cardName: cardName || null,
                cardNumber: cardNumber || null,
                expiryDate: expiryDate || null,
                cvv: cvv || null,
                postedBy: user._id,
            })
            if(data){
                message.success("Your Order has been completed")
                setPaymentOptionClicked('Mpesa');
                setPhoneNumber('');
                setCardName('');
                setCardNumber('');
                setExpiryDate('');
                setCvv('');
                dispatch(reset());
                router.push('/sessions')
            }
        } catch (error) {
            console.log(error)
            message.error("Your Payment Has Not Gone Through")   
        }
    }
    
    return (
    <div className='flex flex-col w-full max-w-[400px] my-4 md:my-0 md:p-6'>
        <h2 className='text-2xl font-semibold text-center md:text-start'>Order Summary</h2>

        <div className='flex flex-col mt-8'>
            {/* <CheckoutLabel label="Subtotal" amount={3000}/> */}
            <div className='flex flex-col my-4'>
                <div className='flex flex-row items-center justify-between mb-4'>
                    <p className=''>Subtotal:</p>
                    <p className='font-semibold'>Ksh {cart.totalAmount}</p>
                </div>
                <hr />
            </div>
            <div className='flex flex-col my-4'>
                <div className='flex flex-row items-center justify-between mb-4'>
                    <p className=''>VÄT (16%):</p>
                    <p className='font-semibold'>Ksh {tax || 0}</p>
                </div>
                <hr />
            </div>
            <div className='flex flex-col my-4'>
                <div className='flex flex-row items-center justify-between mb-4'>
                    <p className=''>Total:</p>
                    <p className='font-semibold'>Ksh {cart.totalAmount + tax}</p>
                </div>
                <hr />
            </div>
        </div>

        <div className='w-full flex flex-row items-center justify-between gap-3 my-4'>
            <button onClick={() => setPaymentOptionClicked("Card")} className='bg-black text-sm w-full text-white py-4'>
                Pay With Card
            </button>
            <button onClick={() => setPaymentOptionClicked("Mpesa")} className='bg-[#FFD02A] text-sm w-full text-black py-4'>
                Pay With Mpesa
            </button>
        </div>

        {paymnetOptionClicked == "Card" ? (
            <div className='w-full flex flex-col py-8 text-sm'>
                <h3 className='text-lg italic mb-4'>Pay With Credit/ Debit Card</h3>
                <p className=''>
                    Please key in your card details below, ensuring that all the deatials are correct
                </p>

                <form className='py-4 gap-2'>
                    <div className='flex flex-col mb-2'>
                        <label className='text-xs text-slate-400'>Name on Card</label>
                        <input type="text" className='w-full p-4 border rounded-md'/>
                    </div>
                    <div className='flex flex-col mb-2'>
                        <label className='text-xs text-slate-400'>Card Number </label>
                        <input type="text" className='w-full p-4 border rounded-md'/>
                    </div>

                    <div className='flex flex-row mb-2 gap-2'>
                        <div className='flex flex-col'>
                            <label className='text-xs text-slate-400'>Expiry Date</label>
                            <input type="text" className='w-full p-4 border rounded-md'/>
                        </div>
                        <div className='flex flex-col'>
                            <label className='text-xs text-slate-400'>CVV</label>
                            <input type="text" className='w-full p-4 border rounded-md'/>
                        </div>
                    </div>

                    <button className='bg-[#FFD02A] p-4 text-black my-4 w-full'>
                        Pay Now
                    </button>
                </form>
            </div>
        ) : (
            <div className='w-full flex flex-col py-8 text-sm'>
                <h3 className='text-lg italic mb-4'>Pay With M-Pesa</h3>
                <p className=''>
                    You will receive an stk push notification on your phone, please enter your pin and approve the transaction
                </p>

                <form className='py-4 gap-2'>
                    <div className='flex flex-col mb-2'>
                        <label className='text-xs text-slate-400'>Phone Number</label>
                        <input type="text" className='w-full p-4 border rounded-md'/>
                    </div>

                    <button onClick={(e) => handleClick(e)} className='bg-[#FFD02A] p-4 text-black my-4 w-full'>
                        Pay Now
                    </button>
                </form>
            </div>
            
        )}
        
    </div>
  )
}