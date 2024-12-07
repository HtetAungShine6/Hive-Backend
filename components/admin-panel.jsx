import { Sidebar } from './ui/sidebar'
import { Header } from './ui/header'
import { SearchBar } from './ui/search-bar'
import { UserTable } from './ui/user-table'
import { LoginForm } from './auth/login-form'

export function AdminPanel() {
  const user = true
  if (!user) {
    return <LoginForm />
  } else {
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
