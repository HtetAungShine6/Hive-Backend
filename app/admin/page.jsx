// import { AdminPanel } from '../../components/admin-panel'

// export default function AdminPage() {
//   return <AdminPanel />
// }

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '../../components/auth/login-form'
import { AdminPanel } from '../../components/admin-panel'
import { useAuthStore } from '../../zustand/admin-store'

export default function AdminPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? <AdminPanel /> : <LoginForm />
}
