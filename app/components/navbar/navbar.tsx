'use client'
import React, { useState, useEffect } from 'react'
import styles from './styles.module.css';
import { getDefaultAvatar, getLogoPath } from '@/utils/getImagePath'
import NavLink from './navlink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronRight, faClose } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { userAuthentication } from '@/auth/userAuth';
import { getToken } from '@/utils/getAuthToken';
import { checkUserRole } from '@/utils/checkUserRole';
import { domain } from '@/constants/constans';
import Link from 'next/link';
import ChangePassModal from './changePassModal';

const logoPath = getLogoPath();

const Navbar = () => {
  const isAuthorized = userAuthentication();
  const [avatar, setAvatar] = useState(getDefaultAvatar());
  const { push } = useRouter()
  const [changePassModal, setChangePassModal] = useState(false);

  const handleSignOut = () => {
    Cookies.remove('jwtToken');
    push('/login');
  }

  // get user profile
  useEffect(() => {
    if (!isAuthorized) {
      return push('/login');
    }

    const getUserProfile = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error('Unauthorized');
        }

        const response = await fetch(`${domain}/api/user-profile`, {
          method: 'GET',
          headers: { Authorization: token }
        })

        const result = await response.json();

        if (result.result.length != 1) {
          return push('/complete-profile');
        }

        const [{ user_avatar: { type, data } }] = result.result;
        const buffer = Buffer.from(data);

        const base64Image = buffer.toString('base64');
        const avatarUrl = `data:image/png;base64,${base64Image}`;

        setAvatar(avatarUrl);

      } catch (err) {
        console.error(err);
        push('/login');
      }
    }
    
    getUserProfile();
  }, [])

  const handleChangePass = (e: React.MouseEvent<HTMLButtonElement>) => {
    setChangePassModal(true);
  }

  const onCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    setChangePassModal(false)
  }

  return (
    <>
      {changePassModal && <ChangePassModal onCancel={onCancel}/>}
      <nav className='w-full lg:px-6 px-2 border-b-2 border-gray-300'>
        <div className='h-16 justify-between flex'>
          <div className='flex lg:w-80 w-44 h-full items-center'>
            <img src={logoPath} alt='logo' />
          </div>

          {/* desktop navlink */}
          <div className={`${styles.desktop}`}>
            <NavLink icon="Home" url="/home" />
            <div className="dropdown dropdown-bottom dropdown-end flex p-4 items-center">
              <div className="avatar cursor-pointer" tabIndex={0}>
                <div className="w-10 rounded-full ring ring-green-700 ring-offset-1">
                  <img src={avatar} />
                </div>
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-gray-100 rounded-box w-52 hover:text-green-700">
                <li><button onClick={handleChangePass}>Change Password</button></li>
                <li><button onClick={handleSignOut}>Sign out</button></li>
              </ul>
            </div>
          </div>

          <div className={`${styles.mobile}`}>
            <NavLink icon="Home" url="/home" />
            <div className="drawer drawer-end">
              <input id="my-drawer" type="checkbox" className="drawer-toggle" />
              <div className="drawer-content hover:text-green-700 lg:text-xl lg:p-6 p-3 flex items-center" >
                <label htmlFor="my-drawer" className=''>
                  <FontAwesomeIcon icon={faBars} />
                </label>
              </div>
              <div className="drawer-side z-10">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-green-700 text-white">
                  <li className='text-xl mb-4'>
                    <label htmlFor="my-drawer">
                      <FontAwesomeIcon icon={faClose} />
                    </label>
                  </li>
                  {/* Sidebar content here */}
                  <li><button className='justify-between' onClick={handleChangePass}>Change Password <FontAwesomeIcon icon={faChevronRight} /></button></li>
                  <li><button onClick={handleSignOut} className='justify-between'>Sign out <FontAwesomeIcon icon={faChevronRight} /></button></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
