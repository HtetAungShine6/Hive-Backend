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
              (user) => user.verficatiionStatus == 'notVerified'
            )
          })
        }
      })
      .catch((error) => console.error('Error fetching users:', error))
  }, [])

  const verifyUser = (id) => {
    window.confirm('Are you sure you want to verify this user?')
    fetch(`/api/users/verify`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userid: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data.user)
          setUsers((prevUsers) => {
            return prevUsers.filter((user) => user._id !== id)
          })
        }
      })
      .catch((error) => console.error('Error verifying user:', error))
  }

  const rejectUser = (id) => {
    window.confirm('Are you sure you want to reject this user?')
    fetch(`/api/users/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userid: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUsers((prevUsers) => {
            return prevUsers.filter((user) => user._id !== id)
          })
        }
      })
      .catch((error) => console.error('Error rejecting user:', error))
  }

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

            <th className='py-4 text-left'>Actions</th>
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

                <td className='py-4'>
                  <div className='flex gap-2'>
                    <button
                      className='p-2 bg-green-400 hover:bg-green-900 rounded-lg'
                      onClick={() => verifyUser(user._id)}
                    >
                      <BookCheck className='w-5 h-5 text-white' />
                    </button>
                    <button
                      className='p-2 bg-red-400 hover:bg-red-900 rounded-lg'
                      onClick={() => rejectUser(user._id)}
                    >
                      <BadgeX className='w-5 h-5 text-white' />
                    </button>
                  </div>
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
