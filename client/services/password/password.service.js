import useApi from '@/services/apiConfig';
const api = useApi();

export const updatePassword = async (email, otp, password) => {
    return (await api.put('/password/updatePassword', { email, otp, password }))
        .data;
};
