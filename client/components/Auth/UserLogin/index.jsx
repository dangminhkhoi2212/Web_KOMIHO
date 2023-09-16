'use client';
import { signOut, useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'flowbite-react';
import { useCookies } from 'react-cookie';

import { loginWithGoogle } from '@/services/auth.service';
import { resetUser, setUser } from '@/components/Auth/authSlice';
import { setAlert } from '@/components/Alert/alertSlice';
import Loading from '@/components/Loading';
import { getUserId } from '@/redux/selector';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Modal from '@/components/Modal';
const UserLogin = ({ children }) => {
    const [cookies, setCookie] = useCookies(['access_token', 'refresh_token']);
    const userId = useSelector(getUserId);
    const { data: session, status } = useSession();
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const login = async () => {
            try {
                if (session && session.id_token) {
                    if (!userId) {
                        const result = await loginWithGoogle(session.id_token);
                        console.log(
                            '🚀 ~ file: index.jsx:23 ~ login ~ result:',
                            result,
                        );
                        if (result.isDeleted) {
                            setShowModal(true);
                        }
                        dispatch(setUser(result));
                        dispatch(
                            setAlert({
                                status: 'success',
                                message: 'Login successfully.',
                            }),
                        );
                        setCookie('accessToken', result.accessToken);
                        setCookie('refreshToken', result.refreshToken);
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
    if (status === 'loading') return <Loading loadingStatus={true} />;
    return (
        <>
            {showModal && (
                <Modal label={'RECOVER ACCOUNT'}>
                    <h1 className="text-center">
                        Do you want recover this account?
                    </h1>
                    <div className="flex justify-center gap-4">
                        <Button
                            color="failure"
                            onClick={() => {
                                alert('yes');
                            }}>
                            Yes, I'm sure
                        </Button>
                        <Button color="gray" onClick={() => signOut()}>
                            No, cancel
                        </Button>
                    </div>
                </Modal>
            )}
            {children}
        </>
    );
};

export default UserLogin;
