'use client';
import { useState, useEffect } from 'react';
import { getAlert } from '@/redux/selector';
import { useSelector } from 'react-redux';
import Alert from '@/components/Alert';
const ShowAlert = ({ children }) => {
    const alert = useSelector(getAlert);
    const [id, setId] = useState('');
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
    useEffect(() => {
        setId(alert?.id);
        setStatus(alert?.status);
        setMessage(alert?.message);
    }, [alert]);
    return (
        <>
            {id && <Alert id={id} status={status} message={message} key={id} />}
            {children}
        </>
    );
};

export default ShowAlert;
