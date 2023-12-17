'use client'
import AdminNav from '@/app/components/admin-navbar/adminnav'
import React, { useEffect, useState } from 'react'
import Request from './request'
import Footer from '@/app/components/footer/footer'
import { checkUserRole } from '@/utils/checkUserRole'
import { domain } from '@/constants/constans'
import { getToken } from '@/utils/getAuthToken'
import { io } from 'socket.io-client'
import { useRouter } from 'next/navigation'

type Appointment = {
    appointment_id: string,
    appointment_date: string,
    appointment_time: string,
    appointment_office: string,
    appointment_status: string,
    info_id: string,
    user_id: string,
    user_fullname: string,
    user_email: string,
}

const Page = () => {
    const { push } = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [active, setActive] = useState('all');

    useEffect(() => {
        const token = getToken();
        if (!token) {
            return push('/login')
        }

        const authUser = async () => {
            try {
                const role = checkUserRole();
                if (role == 'visitor') {
                    return push('/home');
                }
            } catch (err) {
                return push('/login')
            }
        }

        authUser();
    }, [])

    useEffect(() => {
        const getAppointments = async () => {
            try {
                const office = checkUserRole();

                const token = getToken();
                if (!token) {
                    throw new Error('token is missing!');
                }

                const response = await fetch(`${domain}/api/appointment/${office}/all`, {
                    method: 'get',
                    headers: { Authorization: token },
                })

                if (response.ok) {
                    const result = await response.json();
                    setAppointments(result.appointments);
                    setLoading(false);
                }

            } catch (err) {
                console.error(err);
            }
        }
        getAppointments();
    }, [])

    useEffect(() => {
        const socket = io(`${domain}`, {
            transports: ['websocket']
        })

        socket.connect();
        socket.emit('joinRoom', checkUserRole())

        socket.on('appointment_update', (update) => {
            setAppointments((prevAppointments) => {
                const updatedAppointments = prevAppointments.map((appointment) => {
                    if (appointment.appointment_id == update?.id) {
                        // Update the appointment_status in the matching appointment
                        return { ...appointment, appointment_status: update?.status }
                    }
                    return appointment;
                });

                return updatedAppointments;
            });
        })

        return () => {
            socket.disconnect();
        }
    }, [])

    useEffect(() => {
        const socket = io(`${domain}`, {
            transports: ['websocket']
        })

        socket.connect();
        socket.emit('joinRoom', checkUserRole())

        socket.on('new_request', (request) => {
            setAppointments((prevData) => [...prevData, ...request])
        })


        return () => {
            socket.disconnect();
        }
    }, [])

    const handleAll = async (e: React.MouseEvent<HTMLButtonElement>) => {
        try {
            setLoading(true);
            setActive('all')
            const office = checkUserRole();

            const token = getToken();
            if (!token) {
                throw new Error('token is missing!');
            }

            const response = await fetch(`${domain}/api/appointment/${office}/all`, {
                method: 'get',
                headers: { Authorization: token },
            })

            if (response.ok) {
                const result = await response.json();
                setAppointments(result.appointments);
                setLoading(false);
            }

        } catch (err) {
            console.error(err);
        }
    }

    const handlePending = async (e: React.MouseEvent<HTMLButtonElement>) => {
        try {
            setLoading(true);
            setActive('pending');
            const office = checkUserRole();

            const token = getToken();
            if (!token) {
                throw new Error('token is missing!');
            }

            const response = await fetch(`${domain}/api/appointment/${office}/pending`, {
                method: 'get',
                headers: { Authorization: token },
            })

            if (response.ok) {
                const result = await response.json();
                setAppointments(result.appointments);
                setLoading(false);
            }

        } catch (err) {
            console.error(err);
        }
    }

    const handleRejected = async (e: React.MouseEvent<HTMLButtonElement>) => {
        try {
            setLoading(true);
            setActive('rejected');
            const office = checkUserRole();

            const token = getToken();
            if (!token) {
                throw new Error('token is missing!');
            }

            const response = await fetch(`${domain}/api/appointment/${office}/rejected`, {
                method: 'get',
                headers: { Authorization: token },
            })

            if (response.ok) {
                const result = await response.json();
                setAppointments(result.appointments);
                setLoading(false);
            }

        } catch (err) {
            console.error(err);
        }
    }

    const handleAttended = async (e: React.MouseEvent<HTMLButtonElement>) => {
        try {
            setLoading(true);
            setActive('attended');
            const office = checkUserRole();

            const token = getToken();
            if (!token) {
                throw new Error('token is missing!');
            }

            const response = await fetch(`${domain}/api/appointment/${office}/attended`, {
                method: 'get',
                headers: { Authorization: token },
            })

            if (response.ok) {
                const result = await response.json();
                setAppointments(result.appointments);
                setLoading(false);
            }

        } catch (err) {
            console.error(err);
        }
    }

    const handleNoShow = async (e: React.MouseEvent<HTMLButtonElement>) => {
        try {
            setLoading(true);
            setActive('noshow');
            const office = checkUserRole();

            const token = getToken();
            if (!token) {
                throw new Error('token is missing!');
            }

            const response = await fetch(`${domain}/api/appointment/${office}/noshow`, {
                method: 'get',
                headers: { Authorization: token },
            })

            if (response.ok) {
                const result = await response.json();
                setAppointments(result.appointments);
                setLoading(false);
            }

        } catch (err) {
            console.error(err);
        }
    }

    const handleApproved = async (e: React.MouseEvent<HTMLButtonElement>) => {
        try {
            setLoading(true);
            setActive('approved');
            const office = checkUserRole();

            const token = getToken();
            if (!token) {
                throw new Error('token is missing!');
            }

            const response = await fetch(`${domain}/api/appointment/${office}/approved`, {
                method: 'get',
                headers: { Authorization: token },
            })

            if (response.ok) {
                const result = await response.json();
                setAppointments(result.appointments);
                setLoading(false);
            }

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <div className='h-full relative'>
                <AdminNav />
                <header className='w-full flex justify-between px-80 pt-12 items-center '>
                    <div className='w-full border-b-2 border-gray-400 py-4'>
                        <h1 className='text-3xl font-extrabold text-green-700 flex items-center'>Appointments</h1>
                        <div className='mt-4 flex space-x-10 text-md font-semibold text-gray-500'>
                            <button onClick={handleAll} className={`${active == 'all' && 'text-green-700'}`}>All</button>
                            <button onClick={handlePending} className={`${active == 'pending' && 'text-green-700'}`}>Pending</button>
                            <button onClick={handleRejected} className={`${active == 'rejected' && 'text-green-700'}`}>Rejected</button>
                            <button onClick={handleApproved} className={`${active == 'approved' && 'text-green-700'}`}>Approved</button>
                            <button onClick={handleNoShow} className={`${active == 'noshow' && 'text-green-700'}`}>No-show</button>
                            <button onClick={handleAttended} className={`${active == 'attended' && 'text-green-700'}`}>Attended</button>
                        </div>
                    </div>
                </header>
                {loading ? (
                    <div className='w-full flex justify-center items-center h-5/6 p-12'>
                        Fetching data...
                    </div>
                ) : (
                    appointments.length > 0 ? (
                        <div className='min-h-screen mt-4'>
                            <div className='w-full justify-between px-80'>
                                {active == 'all' ? (
                                    appointments.map((appointment) => (
                                        <Request key={appointment.appointment_id} id={appointment.appointment_id}
                                            name={appointment.user_fullname} date={appointment.appointment_date}
                                            time={appointment.appointment_time} status={appointment.appointment_status}
                                            email={appointment.user_email} office={appointment.appointment_office} />
                                    ))
                                ) : (
                                    appointments.map((appointment) => (
                                        active == appointment.appointment_status && (
                                            <Request key={appointment.appointment_id} id={appointment.appointment_id}
                                                name={appointment.user_fullname} date={appointment.appointment_date}
                                                time={appointment.appointment_time} status={appointment.appointment_status}
                                                email={appointment.user_email} office={appointment.appointment_office} />
                                        )
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className='h-full flex justify-center items-center text-gray-500'>
                            No appointment found.
                        </div>
                    )
                )}
                <Footer />
            </div>
        </>
    )
}

export default Page
