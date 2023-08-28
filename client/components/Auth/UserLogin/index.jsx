import { signIn, signOut, useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getUser } from '@/redux/selector';
import { loginWithGoogle } from '@/services/auth.service';
import { setUser } from '@/components/Auth/authSlice';
import Loading from '@/components/Loading';
const UserLogin = ({ children }) => {
    const user = useSelector(getUser);
    const { data: session, status } = useSession();
    // console.log('🚀 ~ file: index.jsx:12 ~ UserLogin ~ status:', status);
    // console.log('🚀 ~ file: index.jsx:12 ~ UserLogin ~ session:', session);
    const dispatch = useDispatch();
    useEffect(() => {
        const login = async () => {
            try {
                if (session && session.id_token) {
                    if (!user._id) {
                        const result = await loginWithGoogle(session.id_token);
                        dispatch(setUser(result));
                        localStorage.setItem('accessToken', result.accessToken);
                        localStorage.setItem(
                            'refreshToken',
                            result.refreshToken,
                        );
                    }
                }
                return;
            } catch (error) {
                console.log('🚀 ~ file: index.jsx:21 ~ login ~ error:', error);
            }
        };
        login();
    }, [session]);
    if (status === 'loading') return <Loading loadingStatus={true} />;
    return <>{children}</>;
};

export default UserLogin;
