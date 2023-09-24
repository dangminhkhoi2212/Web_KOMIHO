import useApi from './apiConfig';
const api = useApi();

export const addProduct = async (data) => {
    return (await api.post('/product/add/', data)).data;
};
export const updateProduct = async (productId, data) => {
    return (await api.put(`/product/update/${productId}`, data)).data;
};
export const getProductsByUserId = async ({
    userId = '',
    page = 1,
    limit = 5,
    textSearch = '',
    price = '',
    store = '',
}) => {
    return (
        await api.get(
            `/product/get-by-userId/${userId}?page=${page}&limit=${limit}&textSearch=${textSearch}&price=${price}&store=${store}`,
        )
    ).data;
};
export const deleteProduct = async (productId) => {
    return (await api.delete(`/product/delete/${productId}`)).data;
};
export const deleteManyProducts = async (ids) => {
    return (await api.post('/product/delete-many', { ids })).data;
};

export const getProductByProductId = async (productId) => {
    return (await api.get(`/product/${productId}`)).data;
};
