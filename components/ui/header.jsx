'use client'

import { Bell, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname().split('/').pop().toUpperCase()
  const pathnameLower = pathname.toLowerCase()
  return (
    <div className='flex items-center justify-between px-6 py-4 bg-white border-b'>
      <div className='flex items-center gap-2'>
        <h1 className='text-xl font-semibold'>{pathname}</h1>
        <div className='flex items-center gap-2 text-sm text-blue-600'>
          <Link href='#'>Admin Dashboard</Link>
          <span className='text-gray-400'>/</span>
          <span className='text-gray-500'>{pathnameLower}</span>
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <button className='relative'>
          <Bell className='w-5 h-5 text-gray-500' />
          <span className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
            2
          </span>
        </button>
        <button className='flex items-center gap-2'>
          <span className='text-sm'>EN</span>
          <ChevronDown className='w-4 h-4' />
        </button>
      </div>
    </div>
  )
}
