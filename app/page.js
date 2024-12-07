import Link from 'next/link'

export default function Page() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-lg text-center'>
        <h1 className='text-3xl font-bold mb-4'>Admin Dashboard</h1>
        <p className='text-gray-700 mb-6'>
          Sign in to access the admin dashboard
        </p>
        <Link
          href='/admin'
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300'
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}
