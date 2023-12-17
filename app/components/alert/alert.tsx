import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

interface Props {
    message: string;
}

const Alert = (props: Props) => {
    const [visible, setVisible] = useState(true);
    const { message } = props;

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`${styles.alert} ${visible ? styles.visible : styles.hidden}`}>
            {message}
        </div>
    );
};

export default Alert;
