import { formatDate } from '@/utils/formatDate'
import { getDefaultAvatar } from '@/utils/getImagePath'
import { faCalendar, faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import Modal from './modal'
import { domain } from '@/constants/constans'
import { getToken } from '@/utils/getAuthToken'
import { useRouter } from 'next/navigation'
import Preloader from '@/app/components/preloader/preloader'
import ConfirmModal from '@/app/components/modal/confirmModal'
import { checkUserRole } from '@/utils/checkUserRole'
import { io } from 'socket.io-client';

type Request = {
    id: string,
    name: string,
    date: string,
    office: string,
    time: string,
    status: string,
    email: string
}

type Appointment = {
    appointment_id: string,
    appointment_date: string,
    appointment_time: string,
    appointment_office: string,
    appointment_purpose: string,
    appointment_status: string,
    info_id: string,
    user_id: string
    user_fullname: string,
    user_address: string,
    user_phone: string,
    user_avatar: string | null,
    user_email: string
}

const Request = (props: Request) => {
    const { push } = useRouter();
    const { id, name, date, time, status, email, office } = props;
    const [photo, setPhoto] = useState(getDefaultAvatar());
    const [openModal, setOpenModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmText, setConfirmtext] = useState('');
    const [loading, setLoading] = useState(false);
    const [acceptReject, setAcceptReject] = useState('')
    const [selected, setSelected] = useState<Appointment>({
        appointment_id: '',
        appointment_date: '',
        appointment_time: '',
        appointment_office: '',
        appointment_status: '',
        appointment_purpose: '',
        info_id: '',
        user_id: '',
        user_fullname: '',
        user_address: '',
        user_phone: '',
        user_avatar: null,
        user_email: ''
    })

    //select specific appointment
    const handleSelected = async (e: Element) => {
        const id = e.id;
        try {
            setLoading(true)
            const token = getToken();
            if (!token) {
                throw new Error('token is missing!')
            }

            const response = await fetch(`${domain}/api/appointment-details/${id}`, {
                method: 'get',
                headers: { Authorization: token }
            })

            if (response.ok) {
                const result = await response.json();

                const buffer = Buffer.from(result.details[0]?.user_avatar.data);
                const base64Image = buffer.toString('base64');
                const avatarUrl = `data:image/png;base64,${base64Image}`;

                setSelected((prevData) => ({
                    ...prevData,
                    appointment_id: result.details[0]?.appointment_id,
                    appointment_date: result.details[0]?.appointment_date,
                    appointment_time: result.details[0]?.appointment_time,
                    appointment_office: result.details[0]?.appointment_office,
                    appointment_status: result.details[0]?.appointment_status,
                    appointment_purpose: result.details[0]?.appointment_purpose,
                    info_id: result.details[0]?.info_id,
                    user_id: result.details[0]?.user_id,
                    user_fullname: result.details[0]?.user_fullname,
                    user_address: result.details[0]?.user_address,
                    user_phone: result.details[0]?.user_phone,
                    user_avatar: avatarUrl,
                    user_email: result.details[0]?.user_email
                }));

                setLoading(false);
                setOpenModal(true);
            }
        } catch (err) {
            console.error(err);
            push('/login')
        }
    }

    const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
        setOpenModal(false);
    }

    const handleApprove = (e: React.MouseEvent<HTMLButtonElement>) => {
        setConfirmtext(`Are you sure to approve appointment with <strong>${name}</strong>?`)
        setAcceptReject('approved');
        if (openModal) {
            setOpenModal(false);
        }

        setConfirmModal(true);
    }

    const handleReject = (e: React.MouseEvent<HTMLButtonElement>) => {
        setConfirmtext(`Are you sure to reject appointment with <strong>${name}</strong>?`)
        setAcceptReject('rejected');
        if (openModal) {
            setOpenModal(false);
        }

        setConfirmModal(true);
    }

    const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setLoading(true);
        setConfirmModal(false);
        setOpenModal(false);
        try {
            const token = getToken();
            if (!token) {
                throw new Error('token missing')
            }

            const dataToUpdate = new FormData();
            dataToUpdate.append('id', id);
            dataToUpdate.append('status', acceptReject);
            dataToUpdate.append('email', email);
            dataToUpdate.append('name', name);
            dataToUpdate.append('office', office);
            dataToUpdate.append('date', date);
            dataToUpdate.append('time', time);

            const response = await fetch(`${domain}/api/appointment`, {
                method: 'put',
                headers: { Authorization: token },
                body: dataToUpdate
            })

            if (response.ok) {
                setLoading(false)
            }

        } catch (err) {
            setLoading(false);
            console.log(err);
        }
    }

    return (
        <>
            {openModal && <Modal
                key={selected.appointment_id}
                appointment_id={selected.appointment_id}
                appointment_date={selected.appointment_date}
                appointment_time={selected.appointment_time}
                appointment_office={selected.appointment_office}
                appointment_purpose={selected.appointment_purpose}
                appointment_status={selected.appointment_status}
                info_id={selected.info_id}
                user_id={selected.user_id}
                user_fullname={selected.user_fullname}
                user_address={selected.user_address}
                user_phone={selected.user_phone}
                user_avatar={selected.user_avatar}
                user_email={selected.user_email}
                onClose={handleClose}
                handleApprove={handleApprove}
                handleReject={handleReject}
            />}
            {confirmModal && <ConfirmModal header='Confirm Appointment' text={confirmText}
                onCancel={(e: React.MouseEvent<HTMLButtonElement>) => setConfirmModal(false)}
                onConfirm={handleConfirm} />}
            {loading && (
                <div className='modal modal-open'>
                    <Preloader />
                </div>
            )}
            <div className='w-full items-center my-2 rounded-t-md cursor-pointer bg-white shadow-md mt-4'>
                <div className='flex w-full p-4'>
                    <div id={id} className='w-7/12 flex items-center' onClick={(e: React.MouseEvent<HTMLDivElement>) => handleSelected(e.currentTarget)}>
                        <div className="avatar m-3">
                            <div className="w-12 rounded-full">
                                <img src={photo} />
                            </div>
                        </div>
                        <div>
                            <h1 className='text-lg font-semibold over'>{name}</h1>
                            <p className='stat-desc text-gray-400'>Visitor&apos;s name</p>
                        </div>
                    </div>
                    <div className='flex justify-end px-4 w-5/12 items-center'>
                        <div className='flex items-center mr-2'>
                            <FontAwesomeIcon className='p-1 text-green-700' icon={faCalendar} />
                            <div>
                                {formatDate(date)}
                            </div>
                        </div>
                        <div className='flex items-center'>
                            <FontAwesomeIcon className='p-1 text-green-700' icon={faClock} />
                            <div>
                                {time}
                            </div>
                        </div>
                    </div>
                </div>
                {status == 'pending' && (
                    <div className='flex justify-end bg-green-700 rounded-b-md'>
                        <button className='p-2 ml-1 text-white' onClick={handleReject} >Reject</button>
                        <button className='p-2 mr-1 text-white' onClick={handleApprove} >Approve</button>
                    </div>
                )}

                {status == 'approved' && (
                    <div className='flex justify-end bg-green-700 rounded-b-md'>
                        <p className='p-2 ml-1 text-white w-full text-center' >Approved</p>
                    </div>
                )}

                {status == 'rejected' && (
                    <div className='flex justify-end bg-green-700 rounded-b-md'>
                        <p className='p-2 ml-1 text-white w-full text-center' >Rejected</p>
                    </div>
                )}

                {status == 'attended' && (
                    <div className='flex justify-end bg-green-700 rounded-b-md'>
                        <p className='p-2 ml-1 text-white w-full text-center' >Attended</p>
                    </div>
                )}

                {status == 'noshow' && (
                    <div className='flex justify-end bg-green-700 rounded-b-md'>
                        <p className='p-2 ml-1 text-white w-full text-center' >No-Show</p>
                    </div>
                )}
            </div>
        </>
    )
}

export default Request
