import apiConfig from '@/services/apiConfig';
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const api = apiConfig(`${SERVER_URL}/admin`);

export const getAdmin = async (adminId) => {
    return (await api.get(`/${adminId}`)).data;
};
