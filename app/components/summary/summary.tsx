import { domain } from '@/constants/constans'
import { checkUserRole } from '@/utils/checkUserRole'
import { faCalendarAlt, faCalendarCheck, faCalendarXmark, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

type Summary = {
    pending: number,
    rejected: number,
    approved: number,
}

const Summary = () => {
    const [summary, setSummary] = useState<Summary>({
        pending: 0,
        rejected: 0,
        approved: 0,
    })

    useEffect(() => {
        const socket = io(`${domain}`, {
            transports: ['websocket']
        })

        socket.connect();
        socket.emit('joinRoom', checkUserRole())

        socket.on('appointment_update', (update) => {
            const status = update?.status;

            switch (status) {
                case 'pending': setSummary((prevData) => ({
                    ...prevData,
                    pending: prevData.pending += 1
                }))
                    break;

                case 'rejected': setSummary((prevData) => ({
                    ...prevData,
                    rejected: prevData.rejected += 1,
                    pending: prevData.pending -= 1
                }))
                    break;

                case 'approved': setSummary((prevData) => ({
                    ...prevData,
                    approved: prevData.approved += 1,
                    pending: prevData.pending -= 1
                }))
                    break;

                default : setSummary((prevData) => ({
                    ...prevData,
                    approved: prevData.approved -= 1,
                }))
            }
        })

        socket.on('new_request', (request) => {
            setSummary((prevData) => ({
                ...prevData,
                pending: prevData.pending += 1
            }))
        })

        return () => {
            socket.disconnect();
        }
    }, [])  

    useEffect(() => {

        const getSummary = async () => {
            const role = checkUserRole();

            const response = await fetch(`${domain}/api/summary-count/${role}`, {
                method: 'get',
            })

            if (response.ok) {
                const result = await response.json() as Summary;
                setSummary(() => ({
                    pending: result.pending,
                    rejected: result.rejected,
                    approved: result.approved
                }))
            }
        }

        getSummary();
    }, [])

    

    return (
        <div className="flex w-full justify-center">
            <div className='bg-white shadow-md w-3/12 rounded-md p-4 mx-2 cursor-pointer hover:bg-gray-100 hover:animate-pulse'>
                <div className='w-full flex'>
                    <div className='w-8/12'>
                        <div className='stat-value text-yellow-500'>
                            {summary.pending}
                        </div>
                        <div className='stat-title'>
                            Pending
                        </div>
                    </div>
                    <div className='flex w-4/12 justify-center items-center'>
                        <FontAwesomeIcon className='text-4xl text-yellow-500' icon={faCalendarAlt} />
                    </div>
                </div>
            </div>

            <div className='bg-white shadow-md w-3/12 rounded-md p-4 mx-2 cursor-pointer hover:bg-gray-100 hover:animate-pulse'>
                <div className='w-full flex'>
                    <div className='w-8/12'>
                        <div className='stat-value text-red-500'>
                            {summary.rejected}
                        </div>
                        <div className='stat-title'>
                            Rejected
                        </div>
                    </div>
                    <div className='flex w-4/12 justify-center items-center'>
                        <FontAwesomeIcon className='text-4xl text-red-500' icon={faCalendarXmark} />
                    </div>
                </div>
            </div>

            <div className='bg-white shadow-md w-3/12 rounded-md p-4 mx-2 cursor-pointer hover:bg-gray-100 hover:animate-pulse'>
                <div className='w-full flex'>
                    <div className='w-8/12'>
                        <div className='stat-value text-green-500'>
                            {summary.approved}
                        </div>
                        <div className='stat-title'>
                            Approved
                        </div>
                    </div>
                    <div className='flex w-4/12 justify-center items-center'>
                        <FontAwesomeIcon className='text-4xl text-green-500' icon={faCalendarCheck} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Summary
