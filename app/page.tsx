'use client'
import { policy, welcomeMsg } from '@/constants/constans'
import Link from 'next/link'
import Footer from './components/footer/footer'
import Image from 'next/image'
import Header from './components/header/header'
import { useRouter } from 'next/navigation'
import { userAuthentication } from '@/auth/userAuth'
import { useEffect } from 'react'
import { checkUserRole } from '@/utils/checkUserRole'

const menClothes = '/images/men.jpg'
const womenClothes = '/images/women.jpg'

export default function Landing() {
  const {push} = useRouter();
  const isAuthorized = userAuthentication();

  useEffect(() => {
    if (isAuthorized) {
      const role = checkUserRole();
      if (role == 'visitor') {
        return push('/home');
      }

      push('/admin-dashboard');
    }
  }, []);

  return (
    <>
      <Header />
      <div className='px-2 lg:px-12 py-12 flex flex-col lg:flex-row lg:items-center h-full relative'>
        <div className='w-full lg:w-1/2 p-4'>
          <h1 
            className='text-green-700 lg:text-4xl text-lg font-semibold lg:text-left text-center'>
              Universidad de Manila
          </h1>
          <div className='lg:w-10/12 my-4 lg:text-base text-sm text-gray-500 text-justify'>
            {welcomeMsg}
          </div>
          <div>
            
          <Link href='/login'>
            <button className='lg:w-3/12 w-full p-3 text-white rounded-lg bg-green-700 hover:bg-green-800'>
              Get started
            </button>
          </Link>
          </div>
        </div>
        
        <div className='w-full lg:w-1/2'>
          <div className="carousel w-full">
            <div id="slide1" className="carousel-item relative w-full items-center justify-center">
              <div className='w-8/12 text-justify lg:text-base text-xs'>
                <h1 className='lg:text-xl text-lg text-green-700 text-center py-4'>UDM POLICY</h1>
                {policy}
              </div>
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide3" className="btn btn-circle bg-green-700 border-none">❮</a> 
                <a href="#slide2" className="btn btn-circle bg-green-700 border-none">❯</a>
              </div>
            </div> 
            <div id="slide2" className="carousel-item relative w-full">
              <Image src={menClothes} className="w-full" alt='photo' width={1000} height={0}/>
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide1" className="btn btn-circle bg-green-700 border-none">❮</a> 
                <a href="#slide3" className="btn btn-circle bg-green-700 border-none">❯</a>
              </div>
            </div> 
            <div id="slide3" className="carousel-item relative w-full">
              <Image src={womenClothes} className="w-full" alt='photo' width={1000} height={0}/>
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide2" className="btn btn-circle bg-green-700 border-none">❮</a> 
                <a href="#slide1" className="btn btn-circle bg-green-700 border-none">❯</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
