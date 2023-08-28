'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { verifyEmail } from '@/services/auth.service';
import Alert from '@/components/Alert';
import { useDispatch } from 'react-redux';
import { setUser } from '@/components/Auth/authSlice';
const VerifyEmail = () => {
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const email = searchParams.get('email');
    const emailToken = searchParams.get('emailToken');
    const [message, setMessage] = useState('');
    useEffect(() => {
        setMessage('');
        const verify = async () => {
            try {
                const result = await verifyEmail(email, emailToken);
                dispatch(setUser(result));
            } catch (error) {
                setMessage('Verify cannot handle. Please try again!');
            }
        };
        verify();
    }, []);
    return (
        <div className="flex flex-col gap-5 shadow-lg justify-center items-center bg-white rounded-xl mx-auto w-60 p-5">
            {message && <Alert message={message} status={'error'} />}
            <h1 className="font-medium text-xl"> Welcome</h1>
            <Logo />
            <p>Your Account is verified.</p>
            <Link
                href="/"
                className="bg-primary text-white hover:bg-accent px-4 py-2 rounded-xl">
                Go Home
            </Link>
        </div>
    );
};

export default VerifyEmail;
