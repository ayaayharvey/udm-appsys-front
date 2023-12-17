'use client'
import React, { useState, useEffect } from 'react'
import InputField from '../components/input-field/inputField'
import Link from 'next/link'
import SubmitButton from '../components/buttons/submitButton'
import Footer from '../components/footer/footer'
import Alert from '../components/alert/alert'
import { userRegistration } from '@/services/userRegistration'
import { useRouter } from 'next/navigation'
import Preloader from '../components/preloader/preloader'
import Header from '../components/header/header'
import { userAuthentication } from '@/auth/userAuth'

interface RegistrationForm {
  email: string,
  password: string,
  confirmPassword: string,
}

const Signup = () => {
  const { push } = useRouter();
  const isAuthorized = userAuthentication();
  // store data for form.
  const [formData, setFormdData] = useState<RegistrationForm>({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (isAuthorized) {
      push('/home');
    }
  }, []);

  // to make sure that each value is stored, so it can be save to database.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormdData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  // this will run if submit or signup button is press.
  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await validateInput(formData);
      setShowLoader(true)

      const isRegistered = await userRegistration(formData);

      if (isRegistered) {
        push('/login');
        setShowLoader(false);
      }

    } catch (err: any) {
      setShowLoader(false)
      setAlertMessage(err.message)
      return handleShowAlert();
    }
  }

  // this will show an alert components if there something wrong.
  const handleShowAlert = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage('');
    }, 3000)
  }

  return (
    <>
      <div className='h-full relative'>
        {showAlert && <Alert message={alertMessage} />}
        <Header />
        {showLoader ? (
          <div className='flex w-full lg:items-center justify-center lg:h-full'>
            <Preloader />
          </div>
        ) : (
          <>
            <div className='flex w-full lg:items-center justify-center'>
              <div className='lg:w-4/12 w-full px-6 lg:px-6 py-12 lg:bg-white lg:m-12 lg:rounded-lg lg:shadow-lg'>
                <h3 className='lg:text-2xl text-lg font-semibold text-green-700'>Sign up</h3>
                <div className='mt-4'>
                  <form onSubmit={handleSubmitForm}>
                    <InputField key="setEmail" id="setEmail" placeholder='test@example.com' name="email" text='Enter your registered email' type="email" value={formData.email} onChange={handleInputChange} />
                    <InputField key="setpassword" id="setpassword" placeholder='Check your caps-lock' name="password" text='Set your password' type='password' value={formData.password} onChange={handleInputChange} />
                    <InputField key="confirmPassword" id="confirmPassword" placeholder='Check your caps-lock' name="confirmPassword" text='Confirm your password' type='password' value={formData.confirmPassword} onChange={handleInputChange} />
                    <div className='my-4'>
                      <SubmitButton key='sigup' id='signup' text='Sign up' />
                    </div>
                  </form>
                  <div className='flex w-full justify-center mt-2'>
                    <div>
                      <span>Already have an account? </span>
                      <span className='text-green-700'>
                        <Link href="/login">
                          Login
                        </Link>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </>
        )}
      </div>
    </>
  )
}

// to check each entry if valid.
function validateInput(data: RegistrationForm): Promise<boolean> {
  const { email, password, confirmPassword } = data;
  return new Promise((resolve, reject) => {
    

    if (email == '' || password == '') {
      reject(new Error("Don't leave any field empty!"));
    }

    if (password !== confirmPassword) {
      reject(new Error("Password doesn't match!"));
    }

    if (password.length < 8) {
      reject(new Error("Password length must be at least 8 characters"));
    }

    if (!email.includes('@') || !email.includes(".com")) {
      reject(new Error("Email must be valid!"));
    }

    resolve(true);
  })
}

export default Signup
