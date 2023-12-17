import React, { useState, useEffect } from 'react'
import { getDefaultAvatar, getLogoPath } from '@/utils/getImagePath'
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faChevronRight, faClose, faHouse, faUser, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { checkUserRole } from '@/utils/checkUserRole';
import ChangePassModal from '../navbar/changePassModal';



const AdminNav = () => {
    const { push } = useRouter();
    const [userRole, setUserRole] = useState('');
    const [active, setActive] = useState('dashboard')
    const [changePassModal, setChangePassModal] = useState(false);

    const handleSignOut = () => {
        Cookies.remove('jwtToken');
        push('/login');
    }

    useEffect(() => {
        const checkRole = async () => {
            const role = checkUserRole();

            if (role) {
                setUserRole(role);
            }
        }

        checkRole();
    }, [])

    const handleChangePass = (e: React.MouseEvent<HTMLButtonElement>) => {
        setChangePassModal(true);
    }

    const onCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        setChangePassModal(false)
    }


    return (
        <>
            {changePassModal && <ChangePassModal onCancel={onCancel} />}
            <nav className='w-full lg:px-6 px-2 border-b-2 border-gray-300'>
                <div className='h-16 justify-between flex'>
                    <div className='flex lg:w-80 w-44 h-full items-center'>
                        <img src={getLogoPath()} alt='logo' />
                    </div>

                    <div className='flex'>
                        <Link className='hover:text-green-700 lg:text-xl lg:p-4 p-3 flex items-center'
                            href='/admin-dashboard'>
                            <FontAwesomeIcon icon={faHouse} />
                        </Link>
                        {userRole === 'admin' && (
                            <Link className='hover:text-green-700 lg:text-xl lg:p-4 p-3 flex items-center' href='/admin-dashboard/user-management'>
                                <FontAwesomeIcon icon={faUser} />
                            </Link>
                        )}
                        {userRole !== 'Guard' && (
                            <Link className='hover:text-green-700 lg:text-xl lg:p-4 p-3 flex items-center' href='/admin-dashboard/notification'>
                                <FontAwesomeIcon icon={faBell} />
                            </Link>
                        )}
                        <div className="dropdown dropdown-bottom dropdown-end flex p-4 items-center">
                            <div className="avatar cursor-pointer" tabIndex={0}>
                                <div className="w-10 rounded-full ring ring-green-700 ring-offset-1">
                                    <img src={getDefaultAvatar()} />
                                </div>
                            </div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-gray-100 rounded-box w-52 hover:text-green-700">
                                <li><button onClick={handleChangePass}>Change Password</button></li>
                                <li><button onClick={handleSignOut}>Sign out</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default AdminNav
