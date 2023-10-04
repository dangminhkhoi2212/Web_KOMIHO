import useApi from './apiConfig';
const api = useApi();

export const createCartItem = async ({ productId, sellerId, select }) => {
    return (await api.post('/cart-item', { productId, sellerId, select })).data;
};
export const updateCartItem = async ({ cartItemId, select }) => {
    return (await api.put(`/cart-item/${cartItemId}`, { select })).data;
};
export const deleteCartItem = async ({ cartId, cartItemIds }) => {
    cartItemIds = JSON.stringify(cartItemIds);
    return (
        await api.delete(
            `/cart-item?cartId=${cartId}&cartItemIds=${cartItemIds}`,
        )
    ).data;
};
