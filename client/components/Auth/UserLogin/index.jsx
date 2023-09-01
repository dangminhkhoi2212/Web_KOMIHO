import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { loginWithGoogle } from '@/services/auth.service';
import { setUser } from '@/components/Auth/authSlice';
import { setAlert } from '@/components/Alert/alertSlice';
import Loading from '@/components/Loading';
import { getUserId } from '@/redux/selector';
const UserLogin = ({ children }) => {
    const userId = useSelector(getUserId);
    console.log('🚀 ~ file: index.jsx:13 ~ UserLogin ~ user:', userId);
    const { data: session, status } = useSession();
    const dispatch = useDispatch();

    useEffect(() => {
        const login = async () => {
            try {
                if (session && session.id_token) {
                    if (!userId) {
                        const result = await loginWithGoogle(session.id_token);

                        dispatch(setUser(result));
                        dispatch(
                            setAlert({
                                status: 'success',
                                message: 'Login successfully.',
                            }),
                        );
                        localStorage.setItem('accessToken', result.accessToken);
                        localStorage.setItem(
                            'refreshToken',
                            result.refreshToken,
                        );
                    }
                    return;
                }
                return;
            } catch (error) {
                dispatch(
                    setAlert({
                        status: 'failure',
                        message:
                            error?.response?.data?.message || 'Login failed.',
                    }),
                );
            }
        };
        login();
    }, [session]);
    if (status === 'loading') return <Loading loadingStatus={true} />;
    return <>{children}</>;
};

export default UserLogin;
