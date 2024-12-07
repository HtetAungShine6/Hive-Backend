import { Search } from 'lucide-react'

export function SearchBar({ selected }) {
  return (
    <div className='flex items-center justify-between px-6 py-4'>
      <div className='flex items-center gap-4 flex-1'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
          <input
            type='text'
            placeholder='Search User'
            className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        {/* {selected > 0 && (
          <div className="flex items-center gap-2">
            <input type="checkbox" checked className="rounded" />
            <span className="text-sm text-blue-600">{selected} Selected</span>
          </div>
        )} */}
      </div>
      <button className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'>
        Something
      </button>
    </div>
  )
}
