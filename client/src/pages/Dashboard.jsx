import React, { useEffect, useState } from 'react'
import { Gem, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import CreationItem from '../components/CreationItem'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

const Dashboard = () => {
  const [creations, setCreations] = useState([])
  const [loading, setLoading] = useState(true)
  const { getToken, user } = useAuth()

  const getDashboardData = async () => {
    try {
      setLoading(true)
      const token = getToken()
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/user/get-user-creations`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) setCreations(data.creations)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  useEffect(() => { getDashboardData() }, [])

  const imageCount = creations.filter((c) => c.type === 'image').length

  return (
    <div className='h-full overflow-y-scroll p-6'>
      <Toaster />
      <div className='flex justify-start gap-4 flex-wrap'>

        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
          <div className='text-slate-600'>
            <p className='text-sm'>Total Creations</p>
            <h2 className='text-xl font-semibold'>{creations.length}</h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center'>
            <Sparkles className='w-5 text-white' />
          </div>
        </div>

        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
          <div className='text-slate-600'>
            <p className='text-sm'>Images Generated</p>
            <h2 className='text-xl font-semibold'>{imageCount}</h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center'>
            <Sparkles className='w-5 text-white' />
          </div>
        </div>

        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
          <div className='text-slate-600'>
            <p className='text-sm'>Active Plan</p>
            <h2 className='text-xl font-semibold capitalize'>{user?.plan || 'Free'}</h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center'>
            <Gem className='w-5 text-white' />
          </div>
        </div>

      </div>

      <div className='space-y-3'>
        <p className='mt-6 mb-4'>Recent Creations</p>
        {loading ? (
          <div className='flex justify-center items-center py-16'>
            <span className='w-6 h-6 rounded-full border-2 border-t-transparent border-blue-500 animate-spin'></span>
          </div>
        ) : creations.length === 0 ? (
          <div className='flex flex-col items-center gap-3 py-16 text-gray-400 text-sm'>
            <Sparkles className='w-9 h-9' />
            <p>No creations yet. Try one of the AI tools!</p>
          </div>
        ) : (
          creations.map((item) => <CreationItem key={item.id} item={item} />)
        )}
      </div>
    </div>
  )
}

export default Dashboard