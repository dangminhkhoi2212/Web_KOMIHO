'use client';
import { clerkLogin } from '@/services/auth.service';
import { routes } from '@/routes';
import { RedirectToSignIn, useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useClerk } from '@clerk/nextjs';
const EMAIL = process.env.NEXT_PUBLIC_EMAIL;
const Auth = ({ children }) => {
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const { user } = useUser();
    const emailUser = user?.emailAddresses[0]?.emailAddress;
    const router = useRouter();
    const { signOut } = useClerk();
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
            Cookies.set('accessTokenClient', data.accessToken);
            Cookies.set('refreshTokenClient', data.refreshToken);
            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);
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

            if (emailUser && emailUser !== EMAIL) {
                signOut(() => router.push(routes.signIn));
            }
        };
        handleToken();
    }, [isLoaded, userId, sessionId, accessToken, refreshToken, emailUser]);

    return <>{children}</>;
};

export default Auth;
