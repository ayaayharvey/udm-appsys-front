import { formatDate } from '@/utils/formatDate';
import { getDefaultAvatar } from '@/utils/getImagePath';
import { faClose, faEnvelope, faLocation, faLocationDot, faPhone, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

type Appointment = {
    appointment_id: string,
    appointment_date: string,
    appointment_time: string,
    appointment_office: string,
    appointment_purpose: string,
    appointment_status: string,
    info_id: string,
    user_id: string,
    user_fullname: string,
    user_address: string,
    user_phone: string,
    user_avatar: string | null;
    user_email: string,
    onClose: (e: React.MouseEvent<HTMLButtonElement>) => void,
    handleApprove: (e: React.MouseEvent<HTMLButtonElement>) => void,
    handleReject: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const Modal = (props: Appointment) => {
    const {
        appointment_id, appointment_date, appointment_time, appointment_purpose, appointment_status, appointment_office,
        user_fullname, user_email, user_address, user_id, user_phone, user_avatar, onClose, handleApprove, handleReject
    } = props


    let officeToDispplay: string = '';

    switch (appointment_office) {
        case 'OSA': officeToDispplay = 'Office of Student Affairs';
            break;
        case 'ICTO': officeToDispplay = 'ICTO';
            break;
        case 'Registrar': officeToDispplay = 'Registrar';
            break;
        case 'Guidance': officeToDispplay = 'Guidance';
            break;
        case 'CET': officeToDispplay = 'College of Engineering & Technology';
            break;
        case 'CAS': officeToDispplay = 'College of Art & Science';
            break;
        case 'CHS': officeToDispplay = 'College of Health & Science';
            break;
        case 'CBA': officeToDispplay = 'College of Business Administration';
            break;
    }

    return (
        <>
            <dialog id="my_modal_1" className="modal modal-open">
                <div className="modal-box bg-gray-100 w-8/12 max-w-3xl overflow-hidden">
                    <header className='flex justify-between'>
                        <h1 className='text-xl font-semibold text-green-700'>Visitor&apos;s Details</h1>
                        <button className='text-2xl hover:bg-gray-300 px-2 rounded-full' onClick={onClose}>
                            <FontAwesomeIcon icon={faClose} />
                        </button>
                    </header>
                    <div className='my-4 border-b-2 border-gray-400 pb-4'>
                        <div className='flex w-full'>
                            <div className='flex justify-center'>
                                <div className="avatar">
                                    <div className="rounded-full w-20 ring ring-green-700 ring-offset-1">
                                        <Image src={user_avatar ? user_avatar : getDefaultAvatar()} width={100} height={100} alt='photo' />
                                    </div>
                                </div>
                            </div>
                            <div className='w-full pl-3 flex items-center'>
                                <div className='w-fit overflow-hidden border-r-2 border-green-700 pr-2'>
                                    <div className='w-full flex'>
                                        <div className='font-semibold text-lg'>
                                            <p>{user_fullname}</p>
                                        </div>
                                    </div>
                                    <div className='w-full flex'>
                                        <div className='flex justify-center items-center mr-2 w-6 text-green-700'>
                                            <FontAwesomeIcon icon={faEnvelope} />
                                        </div>
                                        <div className=''>
                                            <p>{user_email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-6/12 overflow-hidden ml-2 flex items-center'>
                                    <div className='w-full'>
                                        <div className='w-full flex'>
                                            <div className='flex justify-center items-center mx-2 w-6 text-green-700'>
                                                <FontAwesomeIcon icon={faLocationDot} />
                                            </div>
                                            <div className=''>
                                                <p>{user_address}</p>
                                            </div>
                                        </div>
                                        <div className='w-full flex'>
                                            <div className='flex justify-center items-center mx-2 w-6 text-green-700'>
                                                <FontAwesomeIcon icon={faPhone} />
                                            </div>
                                            <div className=''>
                                                <p>{user_phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='flex text-md'>
                            <div className='font-semibold text-green-700 mr-2'>
                                Office to be visited:
                            </div>
                            <div>
                                {officeToDispplay}
                            </div>
                        </div>
                        <div className='flex text-md'>
                            <div className='font-semibold text-green-700 mr-2'>
                                Date:
                            </div>
                            <div>
                                {formatDate(appointment_date)}
                            </div>
                        </div>
                        <div className='flex text-md'>
                            <div className='font-semibold text-green-700 mr-2'>
                                Time:
                            </div>
                            <div>
                                {appointment_time}
                            </div>
                        </div>
                        <div className='flex text-md'>
                            <div className='font-semibold text-green-700 mr-2'>
                                Purpose:
                            </div>
                            <div>
                                {appointment_purpose}
                            </div>
                        </div>
                    </div>
                    <div>
                        {appointment_status == 'pending' && (
                            <div className="modal-action">
                                <button className="btn bg-transparent text-green-700 border-gray-300 hover:bg-green-700 hover:text-white hover:border-green-700"
                                    onClick={handleReject}>Reject</button>
                                <button className='btn bg-transparent text-green-700 border-gray-300 hover:bg-green-700 hover:text-white hover:border-green-700'
                                    onClick={handleApprove}>Approve</button>
                            </div>
                        )}

                        {appointment_status == 'approved' && (
                            <div className='flex justify-end bg-green-700 rounded-b-md mt-6'>
                                <p className='p-2 ml-1 text-white w-full text-center' >Approved</p>
                            </div>
                        )}

                        {appointment_status == 'rejected' && (
                            <div className='flex justify-end bg-green-700 rounded-b-md mt-6'>
                                <p className='p-2 ml-1 text-white w-full text-center' >Rejected</p>
                            </div>
                        )}

                        {appointment_status == 'attended' && (
                            <div className='flex justify-end bg-green-700 rounded-b-md mt-6'>
                                <p className='p-2 ml-1 text-white w-full text-center' >Rejected</p>
                            </div>
                        )}

                        {appointment_status == 'noshow' && (
                            <div className='flex justify-end bg-green-700 rounded-b-md mt-6'>
                                <p className='p-2 ml-1 text-white w-full text-center' >Rejected</p>
                            </div>
                        )}
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default Modal
