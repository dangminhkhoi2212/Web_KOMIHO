import apiConfig from '@/services/apiConfig';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const api = apiConfig(`${SERVER_URL}/admin/statisticUser`);
export const getUserRegisted = async () => {
    return (await api.get('/register')).data;
};
