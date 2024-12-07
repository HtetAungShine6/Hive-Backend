'use client'

import { useState, useEffect } from 'react'
import {
  ChevronDown,
  ChevronUp,
  BookCheck,
  BadgeX,
  Users,
  ImagePlus,
  Link,
  MapPinHouse,
  UserCheck,
} from 'lucide-react'

export function UserTable() {
  useEffect(() => {
    fetch('/api/users')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUsers(() => {
            return data.message.filter(
              (user) => user.verficatiionStatus == 'approved'
            )
          })
        }
      })
      .catch((error) => console.error('Error fetching users:', error))
  }, [])

  const [users, setUsers] = useState([])
  const [expandedRow, setExpandedRow] = useState(null)

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  return (
    <div className='px-6'>
      <table className='w-full'>
        <thead>
          <tr className='border-b'>
            <th className='py-4 text-left'>Name</th>
            <th className='py-4 text-left'>Email</th>
            <th className='py-4 text-left'>Gender</th>
            <th className='py-4 text-left'>Date of Birth</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <>
              <tr
                key={user._id}
                className={`border-b ${
                  expandedRow === user._id ? 'bg-blue-50' : ''
                }`}
              >
                <td className='py-4'>
                  <div className='flex items-center gap-3'>
                    <button
                      onClick={() => toggleExpand(user._id)}
                      className='p-1 hover:bg-gray-100 rounded'
                    >
                      {expandedRow === user._id ? (
                        <ChevronUp className='w-4 h-4' />
                      ) : (
                        <ChevronDown className='w-4 h-4' />
                      )}
                    </button>
                    <img
                      src={
                        user.profileImageUrl ||
                        'https://img.freepik.com/premium-vector/flat-icon-userprofile_941526-9280.jpg'
                      }
                      alt=''
                      className='w-8 h-8 rounded-full'
                    />
                    <span>{user.name}</span>
                  </div>
                </td>
                <td className='py-4'>{user.email}</td>
                <td className='py-4'>{user.gender}</td>
                <td className='py-4'>
                  {new Date(user.dateOfBirth).toLocaleDateString()}
                </td>
              </tr>
              {expandedRow === user._id && (
                <tr className='bg-blue-50'>
                  <td colSpan='8' className='py-4 px-16'>
                    <div className='grid grid-cols-5 gap-8'>
                      <div className='flex items-start gap-2'>
                        <ImagePlus className='w-5 h-5 text-gray-400 mt-1' />
                        <div>
                          <h4 className='font-medium mb-1'>
                            Verification Image
                          </h4>
                          <img
                            src={
                              user.verificationImageUrl
                                ? user.verificationImageUrl
                                : user.profileImageUrl
                            }
                            alt=''
                            className='w-40 h-40 rounded-lg'
                          />
                        </div>
                      </div>
                      <div className='flex items-start gap-2'>
                        <Users className='w-5 h-5 text-gray-400 mt-1' />
                        <div>
                          <h4 className='font-medium mb-1'>Bio</h4>
                          <p className='text-sm text-gray-600'>{user.bio}</p>
                        </div>
                      </div>

                      <div className='flex items-start gap-2'>
                        <Link className='w-5 h-5 text-gray-400 mt-1' />
                        <div>
                          <h4 className='font-medium mb-1'>Instagram</h4>
                          <p className='text-sm text-gray-600'>
                            <a
                              href={user.instagramLink}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              {'Visit' || 'Not provided'}
                            </a>
                          </p>
                        </div>
                      </div>
                      <div className='flex items-start gap-2'>
                        <MapPinHouse className='w-5 h-5 text-gray-400 mt-1' />
                        <div>
                          <h4 className='font-medium mb-1'>User From</h4>
                          <p className='text-sm text-gray-600'>{user.about}</p>
                        </div>
                      </div>
                      <div className='flex items-start gap-2'>
                        <UserCheck className='w-5 h-5 text-gray-400 mt-1' />
                        <div>
                          <h4 className='font-medium mb-1'>User Status</h4>
                          <p className='text-sm text-gray-600'>
                            {user.verficatiionStatus}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
      <div className='flex justify-between items-center py-4 text-sm'>
        <span className='text-gray-500'>
          1 - {users.length} of {users.length}
        </span>
        <div className='flex gap-2'>
          <button className='p-2 border rounded hover:bg-gray-50'>&lt;</button>
          <button className='p-2 border rounded hover:bg-gray-50'>&gt;</button>
        </div>
      </div>
    </div>
  )
}
