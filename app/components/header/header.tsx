import { getLogoPath } from '@/utils/getImagePath'
import React from 'react'

const Header = () => {
    return (
        <>
            <nav className='w-full lg:px-6 px-2 border-b-2 border-gray-300'>
                <div className='h-16 justify-between flex'>
                    <div className='flex lg:w-80 w-44 h-full items-center'>
                        <img src={getLogoPath()} alt='logo' />
                    </div>
                </div>
            </nav>
        </>
  )
}

export default Header
