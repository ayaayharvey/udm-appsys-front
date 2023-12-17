import { faInfoCircle, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import RecentReqDetails from './recentReqDetails'
import Link from 'next/link'

const RecentRequest = () => {
    return (
        <div className='w-full'>
            <div className='bg-white shadow-md rounded-md px-6'>
                <header className='pt-6 pb-2 w-full border-b-2 border-gray-300'>
                    <div className='flex justify-between'>
                        <h1 className='font-bold text-2xl text-green-700'>Recent request</h1>
                        <div className='flex items-center'>
                            {/* <FontAwesomeIcon className='p-2 text-lg text-green-700' icon={faCalendar}/> */}
                        </div>
                    </div>
                    <div className='text-gray-400 flex items-center'>
                        <FontAwesomeIcon className='p-1 text-yellow-400' icon={faInfoCircle} />
                        <p>Quick action for latest appointment request.</p>
                    </div>
                </header>
                <main className='max-h-50 h-50 overflow-y-scroll'>
                    <RecentReqDetails />
                </main>
                <footer className='w-full border-t-2 border-gray-300'>
                    <button className='w-full p-2 text-blue-500'>
                        <Link href='/admin-dashboard/notification'>
                            View all request
                        </Link>
                    </button>
                </footer>
            </div>
        </div>
    )
}

export default RecentRequest
