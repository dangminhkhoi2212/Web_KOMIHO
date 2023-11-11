import useApi from './apiConfig';
const api = useApi();

export const createFeedBack = async (data) => {
    return (await api.post('/feedback', data)).data;
};
export const getFeedback = async ({
    productId,
    userId,
    orderItemId,
    stars,
}) => {
    const query = {
        productId,
        userId,
        orderItemId,
        stars,
    };

    return (await api.get(`/feedback`, { params: query })).data;
};
