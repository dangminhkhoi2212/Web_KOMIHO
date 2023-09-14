import useApi from './apiConfig';
const api = useApi();

export const addProduct = async (data) => {
    return (
        await api.post('/product/add/', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    ).data;
};
export const getProductsByUserId = async ({
    userId = '',
    type = '',
    textSearch = '',
}) => {
    return (
        await api.get(
            `/product/get-by-userId/${userId}?type=${type}&textSearch=${textSearch}`,
        )
    ).data;
};
export const deleteProduct = async (productId) => {
    return (await api.delete(`/product/delete/${productId}`)).data;
};
export const deleteManyProducts = async (ids) => {
    return (await api.post('/product/delete-many', { ids })).data;
};
