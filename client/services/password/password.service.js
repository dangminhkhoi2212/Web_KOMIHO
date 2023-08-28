import useApi from '@/services/apiConfig';
const api = useApi();

export const updatePassword = async (email, otp, password) => {
    return (
        await api.post('/password/updatePassword', { email, otp, password })
    ).data;
};
