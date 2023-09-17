'use client';
import { signOut, useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'flowbite-react';

import { loginWithGoogle } from '@/services/auth.service';
import { resetUser, setUser } from '@/components/Auth/authSlice';
import { setAlert } from '@/components/Alert/alertSlice';
import Loading from '@/components/Loading';
import { getEmailRecover, getUserId } from '@/redux/selector';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Modal from '@/components/Modal';
import VerifyCode from '@/components/Password/VerifyOtp';
import { useMutation } from '@tanstack/react-query';
import { sendMail } from '@/services/email.service';
import { sendOtp } from '@/services/password/otp.service';
import { recoverAccount } from '@/services/user.service';
import { setEmailRecover } from './recoverAccountSlice';
const RecoverAccount = ({ children }) => {
    const email = useSelector(getEmailRecover);
    console.log('🚀 ~ file: index.jsx:23 ~ RecoverAccount ~ email:', email);
    const [showModal, setShowModal] = useState({
        modalEmail: !!email || false,
        modalOtp: false,
    });
    useEffect(() => {
        setShowModal({
            modalEmail: !!email || false,
            modalOtp: false,
        });
    }, [email]);
    const dispatch = useDispatch();

    const handleSendEmail = useMutation({
        mutationFn: () => {
            return sendOtp(email);
        },
        onSuccess(data) {
            setShowModal({ modalEmail: false, modalOtp: true });
            toast.success('Please check your email.');
        },
        onError(error) {
            toast.error('Please try again');
        },
    });
    const handleRecoverAccount = useMutation({
        mutationFn: () => {
            return recoverAccount(email);
        },
        onSuccess(data) {
            toast.success('Your account has been recovered successfully');
            setShowModal({ modalEmail: false, modalOtp: false });
            dispatch(setUser(data));
            dispatch(setEmailRecover(null));
            toast.success('Login successfully.');

            Cookies.set('accessToken', data.accessToken);
            Cookies.set('refreshToken', data.refreshToken);
        },
        onError(err) {
            setShowModal({ modalEmail: true, modalOtp: false });

            toast.error(
                'An error occurred. Please reload this page and try again.',
            );
        },
    });

    return (
        <>
            {(handleSendEmail.isLoading || handleRecoverAccount.isLoading) && (
                <Loading />
            )}
            {showModal.modalEmail && (
                <Modal
                    label={'RECOVER ACCOUNT'}
                    handleEvent={() => setShowModal(false)}>
                    {handleSendEmail.isLoading && <Loading />}
                    <div className="flex flex-col justify-center item-center text-center text-xl mb-2">
                        <h1>Your account is deleted.</h1>
                        <h1 className="text-center">
                            Do you want recover this account?
                        </h1>
                    </div>
                    <div className="flex justify-center gap-4">
                        <Button
                            color="failure"
                            onClick={handleSendEmail.mutate}>
                            Yes, I'm sure
                        </Button>
                        <Button color="gray" onClick={() => signOut()}>
                            No, cancel
                        </Button>
                    </div>
                </Modal>
            )}
            {showModal.modalOtp && (
                <Modal>
                    {handleRecoverAccount.isLoading && <Loading />}

                    <VerifyCode
                        email={email}
                        handleEvent={handleRecoverAccount.mutate}
                    />
                </Modal>
            )}
            {children}
        </>
    );
};

export default RecoverAccount;
