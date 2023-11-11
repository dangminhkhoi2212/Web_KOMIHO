import useApi from './apiConfig';
const api = useApi();

export const login = async (username, password) => {
    return (await api.post('/auth/login', { username, password })).data;
};
export const loginWithGoogle = async (idToken) => {
    return (await api.post('/auth/google/login', { idToken })).data;
};
export const verifyEmail = async (email, emailToken) => {
    return (
        await api.post('/auth/verify-email', {
            email,
            emailToken,
        })
    ).data;
};
export const register = async (name, email, phone, password) => {
    return (await api.post('/auth/register', { name, email, phone, password }))
        .data;
};
export const clerkLogin = async ({ sessionId, userId, sessionToken }) => {
    console.log(
        '🚀 ~ file: auth.service.js:23 ~ clerkLogin ~ { sessionId, userId, sessionToken }:',
        { sessionId, userId, sessionToken },
    );
    return (
        await api.post('/auth/login/clerk', { sessionId, userId, sessionToken })
    ).data;
};
