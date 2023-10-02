import useApi from './apiConfig';
const api = useApi();

export const createCartItem = async ({ productId, sellerId, select }) => {
    return (await api.post('/cart-item', { productId, sellerId, select })).data;
};
export const updateCartItem = async ({ cartItemId, color, size, quantity }) => {
    return (
        await api.put(`/cart-item/${cartItemId}`, { color, size, quantity })
    ).data;
};
export const deleteCartItem = async ({ cartId, cartItemIds }) => {
    const query = { cartId, cartItemIds };
    return (await api.delete(`/cart-item?query=${query}`)).data;
};
