import React from 'react'
import Link from 'next/link'

interface Props {
    id: string,
    text: string,
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const CancelButton = (props: Props) => {
    const {id, text, onClick} = props;

    return (
        <>
            <button className='w-full bg-gray-300 text-gray-900 rounded-lg p-2 hover:bg-gray-400' 
                id={id} onClick={onClick}>
                {text}
            </button>
        </>
    )
}

export default CancelButton
