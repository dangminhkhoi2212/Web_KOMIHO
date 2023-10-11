import useApi from './apiConfig';
const api = useApi();

export const addToCart = async ({ userId, sellerId, productId, select }) => {
    return (await api.post('/cart', { userId, sellerId, productId, select }))
        .data;
};
export const getCart = async ({ userId, getLength, cartIds }) => {
    var query = '';
    if (userId) query += `userId=${userId}`;
    if (getLength) query += `&getLength=${getLength}`;
    if (cartIds) query += `&cartIds=${JSON.stringify(cartIds)}`;
    return (await api.get(`/cart?${query}`)).data;
};
export const deleteCart = async ({ userId, cartIds }) => {
    return (
        await api.delete(
            `/cart?userId=${userId}&cartIds=${JSON.stringify(cartIds)}`,
        )
    ).data;
};
export const updateCart = async ({ cartId, select }) => {
    return (await api.put(`/cart`, { cartId, select })).data;
};
