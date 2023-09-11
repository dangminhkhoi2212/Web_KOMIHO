import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useCookies } from 'react-cookie';
import { loginWithGoogle } from '@/services/auth.service';
import { setUser } from '@/components/Auth/authSlice';
import { setAlert } from '@/components/Alert/alertSlice';
import Loading from '@/components/Loading';
import { getUserId } from '@/redux/selector';
const UserLogin = ({ children }) => {
    const [cookies, setCookie] = useCookies(['access_token', 'refresh_token']);
    const userId = useSelector(getUserId);
    const { data: session, status } = useSession();
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
