import apiConfig from '@/services/apiConfig';
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const api = apiConfig(`${SERVER_URL}/otp`);
export const sendOtp = async (email) => {
    return (await api.post('/sendOtp', { email })).data;
};
export const verifyOtp = async (email, otp) => {
    return (await api.post('/verifyOtp', { email, otp })).data;
};
