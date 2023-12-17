import React, { useState } from 'react'
import InputField from '../components/input-field/inputField';
import { domain } from '@/constants/constans';
import Alert from '../components/alert/alert';
import Preloader from '../components/preloader/preloader';

type ForgotPasword = {
    close: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ForgotPassword = (props: ForgotPasword) => {
    const { close } = props;
    const [email, setEmail] = useState('');
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(true);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setModalOpen(false);
        const emailToSend = new FormData();
        emailToSend.append('email', email);

        const response = await fetch(`${domain}/api/forgot-password`, {
            method: 'post',
            body: emailToSend
        })

        if (response.ok) {
            setLoading(false)
            setEmailSent(true);
        } else {
            const result = await response.json();
            setLoading(false)
            setModalOpen(true);
            return handleAlert(result?.status);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmail(value)
    }

    const handleAlert = (message: string) => {
        setAlertMessage(message);
        setAlert(true);

        setTimeout(() => {
            setAlert(false)
        }, 3000)
    }

    return (
        <>
            {alert && <Alert message={alertMessage} />}
            {loading && (
                <div className='modal modal-open'>
                    <Preloader />
                </div>
            )}
            <dialog id="my_modal_3" className={`modal ${modalOpen && 'modal-open'}`}>
                <div className="modal-box bg-white">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={close}>✕</button>
                    </form>
                    <h3 className="font-bold text-lg text-green-700">Enter your email</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-control w-full py-4">
                            <label className="label">
                                <span className="label-text text-gray-900">Enter your registered email</span>
                            </label>
                            <input id='email' name='email' type="email" placeholder='test@example.com' onChange={handleInputChange}
                                className="lg:bg-transparent lg:border-gray-300 bg-slate-200 w-full border-2 p-2 rounded-md outline-none focus:border-green-700" />
                        </div>
                        <button className='w-full bg-green-700 text-white rounded-lg p-2 hover:bg-green-800'
                            id='btn' type='submit'>
                            Reset Password
                        </button>
                    </form>
                </div>
            </dialog>
            {emailSent && (
                < dialog id="my_modal_3" className="modal modal-open">
                    <div className="modal-box bg-white">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => {setModalOpen(true); setEmailSent(false)}}>✕</button>
                        </form>
                        <h3 className="font-bold text-lg text-green-700">Check your email</h3>
                        <p className="py-4">A password reset link has been sent to your email.</p>
                    </div>
                </dialog >
            )}
        </>
    )
}

export default ForgotPassword
