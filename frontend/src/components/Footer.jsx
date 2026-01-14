import React from 'react'

const Footer = () => {
  return (
    <footer className='border-t-2 mt-3 border-gray-400 flex flex-col gap-3'>
         <div className='flex justify-between py-3 px-10 items-center'>
            <h1 className='text-lg md:text-2xl cursor-pointer font-bold text-gray'>Store 
            <span className="text-[#df4b4b] font-extrabold"> Rating</span>
        </h1>
        <div className='flex flex-col gap-2'>
            <p className='font-normal md:font-medium text-sm'>storerating@example.com</p>
            <p className='font-normal md:font-medium text-sm'>+91 0000 000 000</p>
        </div>
         </div>
         <hr className='w-full text-gray-400' />
         <p className=' text-sm mb-3 text-center'>© 2026 Store Rating App. All rights reserved.</p>
    </footer>
  )
}

export default Footer
