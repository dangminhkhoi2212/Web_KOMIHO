import useApi from './apiConfig';
const api = useApi();
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
// const api = apiConfig(`/auth`);

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
