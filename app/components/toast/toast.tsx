import React, { useEffect, useState } from 'react'

const Toast = (props: { text: string }) => {
    const { text } = props;
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);


    return (
        visible && (
            <div className="toast toast-center toast-top">
                <div className="alert alert-info text-white bg-blue-500">
                    <span>{text}</span>
                </div>
            </div>
        )
    )
}

export default Toast
