import useApi from '@/services/apiConfig';
const api = useApi();
export const sendOtp = async (email) => {
    return (await api.post('/otp/sendOtp', { email })).data;
};
export const verifyOtp = async (email, otp) => {
    return (await api.post('/otp/verifyOtp', { email, otp })).data;
};
