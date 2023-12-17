'use client'
import React, { useEffect, useState } from 'react'
import Header from '../components/header/header'
import { useSearchParams } from 'next/navigation'
import InputField from '../components/input-field/inputField'
import SubmitButton from '../components/buttons/submitButton'
import Alert from '../components/alert/alert'
import { domain } from '@/constants/constans'
import jwt from 'jsonwebtoken';
import Footer from '../components/footer/footer'
import Preloader from '../components/preloader/preloader'
import { useRouter } from 'next/navigation'

type Password = {
    password: string,
    confirmPassword: string,
}

const Page = () => {
    const searchParams = useSearchParams();
    const [newPassword, setNewPassword] = useState<Password>({
        password: '',
        confirmPassword: '',
    })
    const [token, setToken] = useState<string | null>();
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { push } = useRouter();

    useEffect(() => {
        const getToken = searchParams.get('token');
        setToken(getToken);
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await ValidateInput(newPassword);

            if (!token) {
                return new Error('Token is missing');
            }

            const dataToSend = new FormData();
            dataToSend.append('password', newPassword.password);


            const response = await fetch(`${domain}/api/reset-password`, {
                method: 'post',
                headers: { Authorization: token },
                body: dataToSend
            })

            if (response.ok) {
                setLoading(false);
                push('/login')

            } else {
                const result = await response.json();
                setLoading(false)
                handleAlert(result?.status);
            }

        } catch (err: any) {
            setLoading(false);
            handleAlert(err?.message);
        }

    }

    const handleAlert = (message: string) => {
        setAlertMessage(message);
        setAlert(true);
        setTimeout(() => {
            setAlert(false)
        }, 3000)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPassword((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    
    return (
        <>
            {alert && <Alert message={alertMessage} />}
            {loading && (
                <div className='modal modal-open'>
                    <Preloader />
                </div>
            )}
            <div className='h-full relative'>
                <Header />
                <div className='flex w-full lg:items-center justify-center'>
                    <div className='lg:w-4/12 w-full px-6 lg:px-6 py-12 lg:bg-white lg:m-12 lg:rounded-lg lg:shadow-lg'>
                        <h3 className='lg:text-2xl text-lg font-semibold text-green-700'>Change your password</h3>
                        <form onSubmit={handleSubmit}>
                            <InputField key='password' placeholder='Check your caps-lock' type='password' id='password' name='password'
                                onChange={handleInputChange} value={newPassword.password} text='New password' />

                            <InputField key='confirmPassword' placeholder='Check your caps-lock' type='password' id='confirmPassword' name='confirmPassword'
                                onChange={handleInputChange} value={newPassword.confirmPassword} text='Confirm password' />
                            <div className='w-full py-4'>
                                <SubmitButton key='submit' text='Change password' id='submit' />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
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

export default Page
