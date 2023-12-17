'use client'
import React, { useState } from 'react'
import InputField from '../input-field/inputField'
import Alert from '../alert/alert'
import { getToken } from '@/utils/getAuthToken'
import { domain } from '@/constants/constans'
import Preloader from '../preloader/preloader'
import Toast from '../toast/toast'

type Password = {
    password: string,
    confirmPassword: string,
}

type Modal = {
    onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ChangePassModal = (props: Modal) => {
    const { onCancel } = props

    const [newPassword, setNewPassword] = useState<Password>({
        password: '',
        confirmPassword: ''
    })
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(false);
    const [openModal, setOpenMOdal] = useState(true);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPassword((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setOpenMOdal(false);
        try {
            await ValidateInput(newPassword);
            const token = getToken();

            if (!token) {
                return new Error ('Tokken is missing');
            }

            const dataToSend = new FormData();
            dataToSend.append('password', newPassword.password);

            const response = await fetch(`${domain}/api/reset-password`, {
                method: 'post',
                headers: {Authorization: token},
                body: dataToSend
            })
            
            if (response.ok) {
                handleToast();
                setNewPassword(() => ({
                    password: '',
                    confirmPassword: ''
                }))
                setOpenMOdal(true);
                setLoading(false);
            } else {
                const result = await response.json();
                setOpenMOdal(true);
                handleAlert(result?.status);
            }

        } catch (err: any) {
            console.log(err);
            setLoading(false);
            setOpenMOdal(true);
            handleAlert(err?.message)
        }
    }

    const handleAlert = (message: string) => {
        setAlertMessage(message);
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false)
        }, 3000)
    }

    const handleToast = () => {
        setToast(true);
        setTimeout(() => {
            setToast(false)
        }, 3000)
    }

    return (
        <>
            {loading && (
                <div className='modal modal-open'>
                    <Preloader />
                </div>
            )}
            {toast && <Toast text='Password updated.'/>}
            {showAlert && <Alert message={alertMessage}/>}
            <dialog id="my_modal_1" className={`modal ${openModal && 'modal-open'}`}>
                <div className="modal-box bg-white">
                    <h3 className="font-bold text-lg text-green-700">Change Password</h3>
                    <form onSubmit={handleSubmit}>
                        <InputField key='password' id='password' text='Set Password' placeholder='Check your caps-lock'
                            onChange={handleInputChange} name='password' value={newPassword.password} type="password" />

                        <InputField key='confirmPassword' id='passwordPassword' text='Confirm Password' placeholder='Check your caps-lock'
                            onChange={handleInputChange} name='confirmPassword' value={newPassword.confirmPassword} type="password" />
                        <div className='w-full flex py-4 justify-end gap-2'>
                            <button className='btn bg-transparent border-green-700 hover:bg-green-700 hover:border-green-700
                        text-green-700 hover:text-white'
                                onClick={onCancel}>Cancel</button>
                            <button className='btn bg-transparent border-green-700 hover:bg-green-700 hover:border-green-700
                        text-green-700 hover:text-white'
                            >Submit</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    )
}

function ValidateInput(data: Password): Promise<boolean> {
    const { password, confirmPassword } = data;
    return new Promise((resolve, reject) => {
        if (password === '' || confirmPassword === '') {
            reject(new Error(`Don't leave any field empyt!`));
        }

        if (password != confirmPassword) {
            reject(new Error(`Password doesn't match!`));
        }

        if (password.length < 8) {
            reject(new Error(`Password must be at least 8 characters`));
        }

        resolve(true);
    })
}

export default ChangePassModal
