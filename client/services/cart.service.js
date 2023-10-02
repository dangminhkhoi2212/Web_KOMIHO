import useApi from './apiConfig';
const api = useApi();

export const addToCart = async ({ userId, sellerId, cartItemId }) => {
    return (await api.post('/cart', { userId, sellerId, cartItemId })).data;
};
export const getCart = async (userId) => {
    return (await api.get(`/cart/${userId}`)).data;
};
export const deleteCart = async ({ userId, sellerId }) => {
    return (await api.delete(`/cart?query={${(userId, sellerId)}}`)).data;
};
export const getCartsByUserId = async (userId) => {
    return (await api.get(`/cart?userId=${userId}`)).data;
};
