'use client'
import { Sidebar } from '@/components/ui/sidebar'
import { Header } from '@/components/ui/header'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { SearchBar } from '@/components/ui/search-bar'
import { UserTable } from '@/components/ui/rejected-user-table'

import { useAuthStore } from '@/zustand/admin-store'
import { useRouter } from 'next/navigation'

export default function AdminEvents() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  if (!isAuthenticated) {
    router.push('/admin')
  } else {
    const router = usePathname()

    useEffect(() => {
      console.log(router.split('/').pop())
    }, [])

    return (
      <div className='min-h-screen bg-gray-50'>
        <Sidebar />
        <div className='ml-16'>
          <Header />
          <main className='p-6'>
            <div className='bg-white rounded-lg shadow'>
              <SearchBar selected={2} />
              <UserTable />
            </div>
          </main>
        </div>
      </div>
    )
  }
}
