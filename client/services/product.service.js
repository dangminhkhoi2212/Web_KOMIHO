import useApi from './apiConfig';
const api = useApi();

export const addProduct = async (data) => {
    return (await api.post('/product/add/', data)).data;
};
export const updateProduct = async (productId, data) => {
    return (await api.put(`/product/update/${productId}`, data)).data;
};
export const getProducts = async ({
    userId = '',
    page = 1,
    limit = 2,
    textSearch = '',
}) => {
    return (
        await api.get(
            `/product/get-by-userId/${userId}?page=${page}&limit=${limit}&textSearch=${textSearch}`,
        )
    ).data;
};
export const deleteProduct = async ({ productId, userId }) => {
    return (
        await api.delete(
            `/product/delete?productId=${productId}&userId=${userId}`,
        )
    ).data;
};
export const deleteManyProducts = async ({ ids, userId }) => {
    return (await api.post('/product/delete-many', { ids, userId })).data;
};

export const getProductByProductId = async (productId) => {
    return (await api.get(`/product/${productId}`)).data;
};
export const toggleActiveProduct = async ({ productId, active }) => {
    return (
        await api.get(`/product/active?productId=${productId}&active=${active}`)
    ).data;
};
export const getAllProducts = async () => {
    return (await api.get('/product')).data;
};
