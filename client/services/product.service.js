import useApi from './apiConfig';
const api = useApi();

export const addProduct = async (data) => {
    return (await api.post('/product/add/', data)).data;
};
export const updateProduct = async (productId, data) => {
    return (await api.put(`/product/update/${productId}`, data)).data;
};
// export const getProducts = async ({
//     userId = '',
//     page = 1,
//     limit = 9999,
//     textSearch = '',
// }) => {
//     return (
//         await api.get(`/product/get-by-userId`, {
//             params: { userId, page, limit, textSearch },
//         })
//     ).data;
// };
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
export const getAllProducts = async ({
    page = 1,
    limit = 20,
    userId,
    withFullImages = false,
    withDescription,
    star,
    sortBy,
    percent,
    textSearch,
}) => {
    //percentDiscount,sold,ratingStar have value is number
    //topViews, ratingsTotal have value is Boolean
    return (
        await api.get('/product', {
            params: {
                page,
                limit,
                userId,
                withFullImages,
                withDescription,
                sortBy,
                percent,
                star,
                textSearch,
            },
        })
    ).data;
};
