'use client'
import React, { useState, useEffect } from 'react'
import AdminNav from '../components/admin-navbar/adminnav'
import Summary from '../components/summary/summary'
import DailyAppointment from '../components/daily-appointment/dailyAppointment'
import Footer from '../components/footer/footer'
import RecentRequest from '../components/recent-request/recentRequest'
import { checkUserRole } from '@/utils/checkUserRole'
import { useRouter } from 'next/navigation'
import Preloader from '../components/preloader/preloader'
import { io } from 'socket.io-client'
import { domain } from '@/constants/constans'
import { getToken } from '@/utils/getAuthToken'

const AdminHome = () => {
  const { push } = useRouter();
  const [authorized, setAuthorized] = useState(false);  
  const [username, setUsername] = useState('');

  useEffect(() => {
    const authUser = async () => {
      try {
        const role = checkUserRole();
        if (role == 'visitor') {
          return push('/home');
        } else if (role == 'Guard') {
          push('/guard-dashboard')
        }
      } catch (err) {
        return push('/login')
      }
    }

    setAuthorized(true);
    authUser();
  }, [])

  useEffect(() => {
    const getUsername = async () => {
      try {
        const token = getToken();
        if (!token) {
          push('/login');
          return new Error('token missing!')
        }

        const response = await fetch(`${domain}/api/employee-profile`, {
          method: 'get',
          headers: {Authorization: token}
        })

        if (response.ok) {
          const result = await response.json();
          setUsername(result?.profile[0].user_fullname);
        }

      } catch (err) {
        console.log(err);
        return push('/login')
      }
    }

    getUsername();
  }, [])

  if (!authorized) {
    return (
      <div className='h-full relative'>
        <div className='flex w-full lg:items-center justify-center lg:h-full'>
          <Preloader />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='min-h-screen relative'>
        <AdminNav/>
        <div className='w-full px-16 pt-11 pb-4 flex'>
          <div className='w-4/12 flex items-center'>
            <header className='mx-2'>
              <h1 className='text-4xl font-extrabold text-green-700'>Hi, {username}.</h1>
              <p className='text-gray-500 mt-2'>Let&apos;s track your appointment daily.</p>
            </header>
          </div>
          <div className='w-8/12 flex justify-center'>
            <Summary key='summary' />
          </div>
        </div>
        <div className='w-full flex px-16'>
          <div className='w-6/12 flex justify-center px-2 '>
            <DailyAppointment key='daily appointments' />
          </div>
          <div className='w-6/12 flex px-2'>
            <RecentRequest key='recent request' />
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default AdminHome
