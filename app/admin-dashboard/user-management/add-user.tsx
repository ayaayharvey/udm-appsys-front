import Alert from '@/app/components/alert/alert'
import InputField from '@/app/components/input-field/inputField'
import Preloader from '@/app/components/preloader/preloader'
import Toast from '@/app/components/toast/toast'
import { domain } from '@/constants/constans'
import { getToken } from '@/utils/getAuthToken'
import React, { FormEvent, use, useState } from 'react'

type User = {
    fullname: string,
    email: string,
    office: string
}

const AddUser = (props: { onCancel: React.MouseEventHandler<HTMLButtonElement> }) => {
    const [user, setUser] = useState<User>({
        fullname: '',
        email: '',
        office: ''
    })

    const [showAlert, setShowAlert] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [showLoader, setShowLoader] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { value, name } = e.target;
        setUser((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const { value, name } = e.target;
        setUser((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setShowLoader(true)
            const token = getToken();
            if (!token) {
                throw new Error('token is missing');
            }

            await validateInput(user);
            const newUser = new FormData();
            newUser.append('email', user.email);
            newUser.append('fullname', user.fullname);
            newUser.append('office', user.office);

            const response = await fetch(`${domain}/api/employee`, {
                method: 'post',
                headers: { Authorization: token },
                body: newUser
            })

            if (response.ok) {
                const result = await response.json();
                handleToast(result?.status);
                setShowLoader(false);
                setUser((prevData) => ({
                    ...prevData,
                    email: '',
                    fullname: '',
                    office: '',
                }))
            } else {
                const result = await response.json();
                handleAlert(result?.status);
                setShowLoader(false);
            }

        } catch (err: any) {
            setShowLoader(false);
            return handleAlert(err.message);
        }
    }

    const handleAlert = (message: string) => {
        setAlertMessage(message);
        setShowAlert(true);
        setTimeout(() => {
            setAlertMessage('');
            setShowAlert(false);
        }, 3000);
    }

    const handleToast = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => {
            setToastMessage('');
            setShowToast(false);
        }, 3000)
    }

    return (
        <>
            {showToast && <Toast text={toastMessage} />}
            {showAlert && <Alert message={alertMessage} />}
            <dialog id="my_modal_1" className='modal modal-open'>
                {showLoader ? (
                    <Preloader />
                ) : (
                    <div className="modal-box bg-gray-100">
                        <h3 className="font-bold lg:text-lg text-base text-green-700">Add new user</h3>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <InputField key='name' id='fullname' placeholder='Ex. Juan Dela Cruz' type='text'
                                    name='fullname' text='Fullname' value={user.fullname} onChange={handleInputChange} />
                                <InputField key='email' id='email' placeholder='sample@example.com' type='text'
                                    name='email' text='Email' value={user.email} onChange={handleInputChange} />
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text text-gray-900">Office</span>
                                    </label>
                                    <select onChange={handleSelectChange} id='office' name='office' value={user.office}
                                        className="lg:bg-transparent lg:border-gray-300 bg-slate-200 w-full border-2 p-2 rounded-md outline-none focus:border-green-700">
                                        <option value="">None</option>
                                        <option value="OSA">Office of Student Affairs</option>
                                        <option value="ICTO">ICTO</option>
                                        <option value="Registrar">Registrar</option>
                                        <option value="Guidance">Guidance</option>
                                        <option value="Guard">Guard</option>
                                        <option value="CET">College of Engineering & Technology</option>
                                        <option value="CAS">College of Art & Science</option>
                                        <option value="CHS">College of Health Science</option>
                                        <option value="CBA">College of Business Administration</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-action">
                                <button className="btn bg-transparent text-green-700 border-gray-300 hover:bg-green-700 hover:text-white hover:border-green-700"
                                    onClick={props.onCancel} >Cancel</button>
                                <button className='btn bg-transparent text-green-700 border-gray-300 hover:bg-green-700 hover:text-white hover:border-green-700'
                                    type='submit'>Add</button>
                            </div>
                        </form>
                    </div>
                )}
            </dialog>
        </>
    )
}

function validateInput(inputs: User): Promise<boolean> {
    const { fullname, email, office } = inputs;
    return new Promise((resolve, reject) => {
        if (fullname == '' || email == '' || office == '') {
            reject(new Error(`Don't leave any field empty!`))
        }

        if (!email.includes('@') || !email.includes('.com')) {
            reject(new Error(`Enter a valid email!`))
        }

        resolve(true);

    })
}

export default AddUser
