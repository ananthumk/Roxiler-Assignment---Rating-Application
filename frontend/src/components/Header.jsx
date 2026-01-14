import React, { useState } from 'react'
import { UserRoundPen } from 'lucide-react'
import UpdatePassword from './UpdatePs' 
import { useContext } from 'react'
import { AppContext } from '../context/storeContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const [showMenu, setMenu] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false) 

  const { logout } = useContext(AppContext)
  const navigate = useNavigate()
  
  return (
    <>
      <header className='h-[10vh] py-4 px-10 border-b-2 border-gray-500 flex justify-between items-center'>
        <h1 className='text-2xl cursor-pointer font-bold text-gray'>Store 
          <span className="text-[#df4b4b] font-extrabold">Rating</span>
        </h1>

        <div className='relative'>
          <UserRoundPen className='w-7 h-7 cursor-pointer' onClick={() => setMenu(prev => !prev)} />
          
          {/* Dropdown */}
          {showMenu && (
            <div className='absolute right-0 mt-3 w-40 bg-white border border-gray-400 rounded-md shadow-lg flex flex-col z-50'>
              <button 
                className="px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => {
                  setShowPasswordModal(true)  
                  setMenu(false)
                }}
              >
                Update Password
              </button>
              <button onClick={() => {logout()
                navigate('/login')
              }} className="px-4 py-2 text-left text-red-500 hover:bg-gray-100">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

   
      {showPasswordModal && (
        <div 
          className="fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.5)] backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in zoom-in duration-200"
          onClick={() => setShowPasswordModal(false)}
        >
          <div 
            className="bg-white max-w-md w-full max-h-[90vh] overflow-y-auto rounded-md shadow-2xl border animate-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <UpdatePassword 
              onClose={() => setShowPasswordModal(false)}
              onSuccess={() => setShowPasswordModal(false)}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default Header
