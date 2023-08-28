import apiConfig from './apiConfig';
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const api = apiConfig(`${SERVER_URL}/admin`);

export const login = async (username, password) => {
    return (await api.post('/login', { username, password })).data;
};
