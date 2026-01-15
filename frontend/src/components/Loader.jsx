import React from 'react'
import { TailSpin } from 'react-loader-spinner'

const Loader = () => {
    return (
        <div className='h-screen w-full flex justify-center items-center'>

            <TailSpin
                height="80"
                width="80"
                color="#626868"
                ariaLabel="tail-spin-loading"
                
            />

        </div>
    )
}

export default Loader 
