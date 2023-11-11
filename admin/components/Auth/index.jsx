'use client';
import { clerkLogin } from '@/services/auth.service';
import { routes } from '@/routes';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';

const Auth = ({ children }) => {
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const [accessToken, setAccessToken] = useState(
        Cookies.get('accessTokenClient'),
    );
    const [refreshToken, setRefreshToken] = useState(
        Cookies.get('refreshTokenClient'),
    );

    const getTokenMutation = useMutation({
        mutationFn: ({ sessionId, userId, sessionToken }) => {
            return clerkLogin({ sessionId, userId, sessionToken });
        },
        onSuccess(data) {
            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);
            Cookies.set('accessTokenClient', data.accessToken);
            Cookies.set('refreshTokenClient', data.refreshToken);
        },
        onError(error) {
            // Handle error
        },
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        const handleToken = () => {
            if (!isLoaded || !userId || !sessionId) {
                return (
                    <div className="flex justify-center items-center">
                        <p>You might login</p>
                    </div>
                );
            }

            if (!accessToken || !refreshToken) {
                getToken().then(async (sessionToken) => {
                    getTokenMutation.mutate({
                        sessionId,
                        userId,
                        sessionToken,
                    });
                });
            }
        };
        handleToken();
    }, [isLoaded, userId, sessionId, accessToken, refreshToken]);

    return <>{children}</>;
};

export default Auth;
