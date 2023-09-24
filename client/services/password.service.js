import useApi from '@/services/apiConfig';
const api = useApi();

export const updatePassword = async (email, password) => {
    return (await api.put('/password/updatePassword', { email, password }))
        .data;
};
