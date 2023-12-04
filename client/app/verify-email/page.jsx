'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { verifyEmail } from '@/services/auth.service';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import routes from '@/routes';
import { useRouter } from 'next/navigation';
const VerifyEmail = () => {
    const searchParams = useSearchParams();
    const email = searchParams.get('email').replace(' ', '+');
    console.log('🚀 ~ file: page.jsx:14 ~ VerifyEmail ~ email:', email);
    const emailToken = searchParams.get('emailToken');
    const router = useRouter();
    const verifyEmailMutation = useMutation({
        mutationFn: () => {
            return verifyEmail(email, emailToken);
        },
        onSuccess(data) {
            console.log('🚀 ~ file: page.jsx:21 ~ onSuccess ~ data:', data);
            router.push(routes.login);
            toast.success('Verify successfully');
        },
        onError(error) {
            toast.error('Verify cannot handle. Please try again!');
        },
    });
    return (
        <div className="flex flex-col gap-5 shadow-lg justify-center items-center bg-white rounded-xl mx-auto w-60 p-5">
            <h1 className="font-medium text-xl"> Welcome</h1>
            <Logo />
            <p>Verify your account.</p>
            <button
                type="button"
                className="bg-primary text-white hover:bg-accent px-4 py-2 rounded-xl"
                onClick={() => verifyEmailMutation.mutate()}>
                Verify
            </button>
        </div>
    );
};

export default VerifyEmail;
