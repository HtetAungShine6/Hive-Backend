'use client'
import Link from 'next/link'
import { UserCheck, UserX, Settings, User, UserCog, LogOut } from 'lucide-react'
import { useAuthStore } from '../../zustand/admin-store'

export function Sidebar() {
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
  }

  return (
    <div className='fixed left-0 top-0 h-screen w-16 bg-white border-r flex flex-col items-center   py-4 gap-6'>
      <div className='w-10 h-10 bg-blue-600 rounded-lg text-white flex items-center justify-center p-2'>
        Hive
      </div>
      <nav className='flex flex-col gap-8 items-center justify-start flex-1'>
        <Link
          href='/admin/pendingusers'
          className='p-2 rounded-lg hover:bg-gray-100'
        >
          <UserCog className='w-5 h-5 text-gray-500' />
        </Link>
        <Link
          href='/admin/approvedusers'
          className='p-2 rounded-lg hover:bg-gray-100'
        >
          <UserCheck className='w-5 h-5 text-gray-500' />
        </Link>

        <Link
          href='/admin/rejectedusers'
          className='p-2 rounded-lg hover:bg-gray-100'
        >
          <UserX className='w-5 h-5 text-gray-500' />
        </Link>
      </nav>
      <div className='mt-auto flex flex-col gap-4'>
        <Link href='#' className='p-2 rounded-lg hover:bg-gray-100'>
          <Settings className='w-5 h-5 text-gray-500' />
        </Link>
        <Link href='#' className='p-2 rounded-lg hover:bg-gray-100'>
          <LogOut className='w-5 h-5 text-gray-500' onClick={handleLogout} />
        </Link>
      </div>
    </div>
  )
}
