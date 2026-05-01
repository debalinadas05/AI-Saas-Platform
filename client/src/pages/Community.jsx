import { Heart } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { dummyPublishedCreationData } from '../assets/assets'

const Community = () => {

  const [creations, setCreations] = useState([])
  const { user } = useUser()

  const fetchCreations = async () => {
    setCreations(dummyPublishedCreationData)
  }

useEffect(() => {
  fetchCreations()
}, [])

  return (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      
      <div className='bg-white h-full w-full rounded-xl overflow-y-scroll'>

        {creations.map((creation, index) => (
          <div
            key={index}
            className='relative group inline-block pl-3 p-3 w-full sm:w-1/2 lg:w-1/3'
          >
            <img
              src={creation.content}
              alt=""
              className='w-full h-full object-cover rounded-lg'
            />
            {/* Overlay */}
            <div className='absolute bottom-0 top-0 right-0 left-3 
            flex items-end justify-end gap-2 p-3
              group-hover:justify-between
              group-hover:bg-gradient-to-b from-transparent to-black/80
              text-white rounded-lg'>

              <p className='text-sm hidden group-hover:block'>
                {creation.prompt}
              </p>

              <div className='flex gap-1 items-center'>
                <p>{creation.likes.length}</p>
                <Heart
                  className={`min-w-5 h-5 cursor-pointer hover:scale-110
                  ${
                    creation.likes.includes(user?.id) ?
                      'fill-red-500 text-red-600'
                      : 'text-white'
                  }`}
                />
              </div>

            </div>

          </div>
        ))}

      </div>
    </div>
  )
}

export default Community