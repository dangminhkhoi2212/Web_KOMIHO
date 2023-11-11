import useApi from './apiConfig';
const api = useApi();

export const createReport = async ({ userId, productId, content }) => {
    return (await api.post('/report', { userId, productId, content })).data;
};
