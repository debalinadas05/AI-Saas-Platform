import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <div className='fixed z-5 w-full backdrop-blur-2xl flex justify-between
    items-center py-3 px-4 sm:px-20 xl:px-32'>
      <img
        src={assets.logo}
        alt="logo"
        className='w-32 sm:w-44 cursor-pointer'
        onClick={() => navigate('/')}
      />

      {user ? (
        <div className='flex items-center gap-4'>
          <button
            onClick={() => navigate('/ai')}
            className='text-sm text-gray-600 hover:text-gray-900 cursor-pointer'
          >
            Dashboard
          </button>
          <button
            onClick={() => { logout(); navigate('/') }}
            className='text-sm text-red-500 hover:text-red-700 cursor-pointer'
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className='flex items-center gap-2 rounded-full text-sm
          cursor-pointer bg-primary text-white px-10 py-2.5'
        >
          Get started <ArrowRight className='w-4 h-4' />
        </button>
      )}
    </div>
  )
}

export default Navbar