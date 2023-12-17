import { getDefaultAvatar } from '@/utils/getImagePath'
import React, { useState } from 'react'

type info = {
    emId: number,
    name: string,
    office: string,
    email: string,
    avatar: Buffer | null
}

const Employee = (props: info) => {
    const { emId, name, office, avatar, email } = props
    const [profile, setProfile] = useState('');
    let officeToDispplay: string = '';

    useState(() => {
        if (!avatar) {
            setProfile(getDefaultAvatar());
        }
    })

    switch (office) {
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
        case 'Guard' : officeToDispplay = 'Guard';
    }

    return (
        <tr>
            <td>
                <div className="flex items-center space-x-3">
                    <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                            <img src={profile} alt="Avatar Tailwind CSS Component" />
                        </div>
                    </div>
                    <div>
                        <div className="font-bold">{name}</div>
                        <div className="text-sm opacity-50">{email}</div>
                    </div>
                </div>
            </td>
            <td>
                {officeToDispplay}
            </td>
        </tr>
    )
}

export default Employee
