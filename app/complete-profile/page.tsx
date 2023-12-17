'use client'
import React, { useEffect, useState } from 'react'
import { getDefaultAvatar } from '@/utils/getImagePath'
import InputField from '../components/input-field/inputField'
import SubmitButton from '../components/buttons/submitButton'
import CancelButton from '../components/buttons/cancelButton'
import Footer from '../components/footer/footer'
import Alert from '../components/alert/alert'
import { avatarPreview } from '@/utils/avatarPreview'
import Preloader from '../components/preloader/preloader'
import { useRouter } from 'next/navigation'
import { logoutAuth } from '@/auth/logout'
import { completeProfile } from '@/services/completeProfile'
import Toast from '../components/toast/toast'
import Image from 'next/image'
import Header from '../components/header/header'
import { getToken } from '@/utils/getAuthToken'
import { userAuthentication } from '@/auth/userAuth'
import { checkUserRole } from '@/utils/checkUserRole'
import { domain } from '@/constants/constans'

interface ProfileForm {
  fullname: string,
  address: string,
  phone: string,
  avatar: File | null
}

interface AlertType {
  message: string,
  show: boolean,
}

const CompleteProfile = () => {
  const isAuthorized = userAuthentication();
  const { push } = useRouter();

  // for avatar preview.
  const [avatarPrev, setAvatarPrev] = useState(getDefaultAvatar());
  const [showAlert, setShowAlert] = useState<AlertType>({
    show: false,
    message: ''
  });
  const [alertMessage, setAlertMessage] = useState('');
  const [showLoader, setShowLoader] = useState(true)
  const [showToast, setShowToast] = useState(false);

  // get user profile
  useEffect(() => {
    if (!isAuthorized) {
      push('/login');
    }

    const getUserProfile = async () => {
      try {
        const role = await checkUserRole();

        if (role !== 'visitor') {
          push('/admin-dashboard')
        }

        const token = getToken();
        if (!token) {
          throw new Error('Unauthorized');
        }

        const response = await fetch(`${domain}/api/user-profile`, {
          method: 'GET',
          headers: { Authorization: token }
        })

        const result = await response.json();

        if (result.result.length == 1) {
          push('/home')
        }
      } catch (err) {
        push('/login');
      }
    }

    setShowLoader(false)
    getUserProfile();
  }, [])

  const [formData, setFormData] = useState<ProfileForm>({
    fullname: '',
    address: '',
    phone: '',
    avatar: null
  })

  // TO PREVIEW UPLOAD AVATAR.
  const handleImageInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];
    if (image) {
      const result = await avatarPreview(image);
      setAvatarPrev(result);
      setFormData((prevData) => ({
        ...prevData,
        avatar: image,
      }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowLoader(true);
    try {
      await validateInput(formData);
      const dataToSend = new FormData();
      dataToSend.append('fullname', formData.fullname);
      dataToSend.append('address', formData.address);
      dataToSend.append('phone', formData.phone);

      if (formData.avatar) {
        dataToSend.append('avatar', formData.avatar);
      }

      const result = await completeProfile(dataToSend);

      if (result) {
        handleShowToast();
        logoutAuth();
        push('/login');
      }

    } catch (err: any) {
      setShowLoader(false);
      return handleShowAlert(err.message);
    }

  }

  const handleShowAlert = (errorMessage: string) => {
    setShowAlert((prevData) => ({
      ...prevData,
      message: errorMessage,
      show: true
    }));

    setTimeout(() => {
      setShowAlert((prevData) => ({
        ...prevData,
        show: false,
        message: ''
      }));
    }, 3000)
  }

  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000)
  }

  const handleCancel = async () => {
    setShowLoader(true);
    logoutAuth();
    return push('/login');
  }

  return (
    <div className='min-h-screen relative'>
      {showAlert.show && <Alert key='alert' message={showAlert.message} />}
      {showToast && <Toast key='toast' text='Profile upated.' />}
      <Header />
      {showLoader ? (
        <div className='flex w-full lg:items-center justify-center lg:h-full'>
          <Preloader />
        </div>
      ) : (
        <>
          <div className='flex w-full lg:items-center justify-center lg:h-full'>
            <div className='lg:w-4/12 w-full px-6 lg:px-6 py-12 lg:bg-white lg:m-12 lg:rounded-lg lg:shadow-lg'>
              <h3 className='lg:text-2xl text-lg font-semibold text-green-700'>Complete profile</h3>
              <div className='w-full flex justify-center mt-4'>
                <div className='w-full'>
                  <form onSubmit={handleSubmitForm}>
                    <div className='w-full flex justify-center'>
                      <div className='w-36 overflow-hidden'>
                        <div className='justify-center flex p-2'>
                          <div className='w-24 rounded-full ring ring-green-700'>
                            <Image className="w-24 h-24 rounded-full" id="avatar" src={avatarPrev} alt="avatar" width={500} height={500} />
                          </div>
                        </div>
                        <div className='mt-2 relative border-2 rounded-lg border-gray-300 cursor-pointer hover:bg-gray-300'>
                          <input className='absolute h-full opacity-0' type='file' accept='image/jpeg, image/png' name='avatar' onChange={handleImageInput} />
                          <div className='w-full text-center lg:p-2 p-1'>
                            Upload
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='mt-4'>
                      <InputField key="fullname" id="fullname" placeholder='Ex. Juan Dela Cruz' name="fullname" text='Enter your fullname' type='text' value={formData.fullname} onChange={handleInputChange} />
                      <InputField key='address' id="address" name="address" type="text" placeholder='House no., Street name, Municipality' text="Enter your address" value={formData.address} onChange={handleInputChange} />
                      <InputField key='phone' id="phone" name="phone" type='number' placeholder='09XXXXXXXXX' text="Enter your phone number" value={formData.phone} onChange={handleInputChange} />
                      <div className='my-4'>
                        <SubmitButton key="completeProfile" id="completeProfile" text="Complete Profile" />
                      </div>
                      <div>
                        <CancelButton key="cancel" id="cancelCompletion" text="Cancel" onClick={handleCancel} />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
  )
}

function validateInput(data: ProfileForm): Promise<boolean> {
  const { fullname, address, phone, avatar } = data;
  return new Promise((resolve, reject) => {

    if (avatar == null) {
      reject(new Error('Upload profile picture'))
    }

    if (fullname == '' || address == '' || phone == '') {
      reject(new Error(`Don't leave any field empty!`));
    }

    if (address.length < 10) {
      reject(new Error(`Enter a valid address!`));
    }

    if (phone.length < 10 || phone.length > 13) {
      reject(new Error(`Enter a valid phone number!`));
    }

    resolve(true);
  })
}

export default CompleteProfile
