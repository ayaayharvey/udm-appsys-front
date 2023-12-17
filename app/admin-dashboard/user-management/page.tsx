'use client'
import AdminNav from '@/app/components/admin-navbar/adminnav'
import { getDefaultAvatar } from '@/utils/getImagePath'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import Employee from './employee'
import AddUser from './add-user'
import { domain } from '@/constants/constans'
import { getToken } from '@/utils/getAuthToken'
import Footer from '@/app/components/footer/footer'
import { io } from 'socket.io-client'
import Preloader from '@/app/components/preloader/preloader'
import { checkUserRole } from '@/utils/checkUserRole'
import { useRouter } from 'next/navigation'

type EmployeeType = {
    user_id: number,
    user_email: string,
    user_fullname: string,
    user_role: string,
    user_avatar: Buffer | null
};

const Page = () => {
    const {push} = useRouter();
    
    const [addUser, setAddUser] = useState(false);

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setAddUser(false);
    }

    const [employeeAccounts, setEmployeeAccounts] = useState<EmployeeType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const socket = io(`${domain}`, {
            transports: ['websocket']
        })

        socket.connect();
        socket.on('new_user', (user) => {
            setEmployeeAccounts((prevData) => [...prevData, ...user])
        })
    }, [])

    useEffect(() => {
        const authenticateUser = async () => {
            const token = getToken();
            const role = checkUserRole();
            
            if (!token) {
                push('/login');
            }

            if (role != 'admin') {
                push('/login')
            }
        }

        authenticateUser();

        const getEmployee = async () => {
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('token is missing!');
                }

                const response = await fetch(`${domain}/api/employee`, {
                    method: 'get',
                    headers: { Authorization: token }
                })

                if (response.ok) {
                    const result = await response.json();
                    setEmployeeAccounts(result.employees);
                    setLoading(false);
                }
            } catch (err) {
                console.error(err);
            }
        }

        getEmployee();
    }, [])

    return (
        <>
            <div className='h-full relative'>
                {addUser && <AddUser onCancel={handleCancel} />}
                <AdminNav/>
                <header className='w-full flex justify-between p-12 items-center'>
                    <h1 className='text-3xl font-extrabold text-green-700 flex items-center'>User list</h1>
                    <div className='w-fit flex'>
                        {/* <select className='bg-transparent border-2 border-green-700 px-3 rounded-md outline-none mx-1'>
                        <option value="">All</option>
                        <option value="OSA">OSA</option>
                        <option value="ICTO">ICTO</option>
                        <option value="Registrar">Registrar</option>
                        <option value="Guidance">Guidance</option>
                        <option value="CET">CET</option>
                        <option value="CAS">CAS</option>
                        <option value="CHS">CHS</option>
                        <option value="CBA">CBA</option>
                    </select> */}
                        <button onClick={() => setAddUser(true)} className='btn btn-md bg-green-700 text-white hover:bg-green-800 border-none border-transparent mx-1'>
                            <FontAwesomeIcon icon={faPlusCircle} />
                            New User
                        </button>
                    </div>
                </header>
                <div className="overflow-x-auto px-12 h-full">
                    {loading ? (
                        <div className='w-full flex justify-center items-center h-full'>
                            Getting users...
                        </div>
                    ) : (
                        employeeAccounts.length > 0 ? (
                            <table className="table">
                                {/* head */}
                                <thead className='text-gray-500 text-md'>
                                    <tr>
                                        <th>Name</th>
                                        <th>Office</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employeeAccounts.map((account) => (
                                        <Employee key={account.user_id} emId={account.user_id} name={account.user_fullname} email={account.user_email} office={account.user_role} avatar={account.user_avatar} />
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className='flex min-h-screen items-center justify-center w-full text-gray-500'>
                                No user found.
                            </div>
                        )
                    )}
                </div>
                <Footer />
            </div>
        </>
    )
}

export default Page
