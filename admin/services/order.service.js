import useApi from './apiConfig';
const api = useApi();

export const createOrder = async (orders) => {
    return (await api.post('/order', { orders })).data;
};
export const getOrder = async ({ sellerId, userId, status, orderId }) => {
    var query = '';
    if (userId) query += `&userId=${userId}`;
    if (sellerId) query += `&sellerId=${sellerId}`;
    if (status) query += `&status=${status}`;
    if (orderId) query += `&orderId=${orderId}`;
    return (await api.get(`/order?${query}`)).data;
};
export const updateOrder = async ({ orderId, status }) => {
    return (await api.put('/order', { orderId, status })).data;
};
