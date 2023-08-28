import apiConfig from '../apiConfig';
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const api = apiConfig(`${SERVER_URL}/password`);

export const updatePassword = async (email, otp, password) => {
    return (await api.post('/updatePassword', { email, otp, password })).data;
};
