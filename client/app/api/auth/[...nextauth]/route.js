import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { login } from '@/services/auth.service';
import Cookies from 'js-cookie';
import { cookies } from 'next/headers';
const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? '',
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (account && user) {
                token.id_token = account.id_token;
                // Store the token expiration time
                token.id_token_expires = account.expires_in + Date.now() / 1000;
            }
            return token;
        },
        async session({ session, token }) {
            if (
                token.id_token_expires &&
                token.id_token_expires < Date.now() / 1000
            ) {
                try {
                    // If the ID token has expired, refresh it using the refresh token
                    const response = await axios.post(
                        'https://oauth2.googleapis.com/token',
                        {
                            grant_type: 'refresh_token',
                            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                            client_secret:
                                process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
                            refresh_token: token.refresh_token, // The refresh token from the initial login
                        },
                    );

                    const newTokenData = response.data;

                    // Update the session with the new ID token
                    session.id_token = newTokenData.id_token;
                    token.id_token_expires =
                        newTokenData.expires_in + Date.now() / 1000;
                } catch (error) {
                    console.error('Error refreshing ID token:', error);
                    // You can decide how to handle the error here, e.g., log the user out.
                    // For security reasons, you may not want to expose details of the error to the user.
                }
            } else {
                // The token is still valid, use it as is
                session.id_token = token.id_token;
            }

            return session;
        },
    },
});

export { handler as GET, handler as POST };
