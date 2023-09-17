'use client';
import { signOut, useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { loginWithGoogle } from '@/services/auth.service';
import { resetUser, setUser } from '@/components/Auth/authSlice';
import { getUserId } from '@/redux/selector';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Modal from '@/components/Modal';

import { setEmailRecover } from '@/components/RecoverAccount/recoverAccountSlice';
import UpdatePassword from '@/components/Password/UpdatePassword';
import routes from '@/routes';
import { useRouter } from 'next/navigation';
const UserLogin = ({ children }) => {
    const userId = useSelector(getUserId);
    const { data: session, status } = useSession();
    console.log('🚀 ~ file: index.jsx:22 ~ UserLogin ~ session:', session);
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const login = async () => {
            try {
                if (session && session.id_token) {
                    if (!userId) {
                        const result = await loginWithGoogle(session.id_token);

                        if (!result.password) {
                            Cookies.set('accessToken', result.accessToken);
                            Cookies.set('refreshToken', result.refreshToken);
                            setShowModal(true);
                            return;
                        }
                        if (!result.public) {
                            dispatch(setEmailRecover(session.user.email));
                            return;
                        }
                        dispatch(setUser(result));
                        toast.success('Login successfully.');

                        Cookies.set('accessToken', result.accessToken);
                        Cookies.set('refreshToken', result.refreshToken);
                    }
                }
            } catch (error) {
                toast.error('Login error. Please try again later.');
                signOut();
                dispatch(resetUser());
            }
        };
        login();
    }, [session]);

    return (
        <>
            {showModal && (
                <Modal
                    label={'UPDATE PASSWORD'}
                    handleEvent={() => signOut({ callbackUrl: routes.login })}>
                    <UpdatePassword
                        email={session.user.email}
                        handleEvent={() => {
                            setShowModal(false);

                            window.location.reload();
                        }}
                        linkRedirect={routes.home}
                    />
                </Modal>
            )}
            {children}
        </>
    );
};

export default UserLogin;
