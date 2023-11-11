import useApi from './apiConfig';
const api = useApi();

export const toggleFavorite = async ({ userId, favoriteId }) => {
    return (await api.patch('/favorite', { userId, favoriteId })).data;
};
export const checkFavorite = async ({ userId, favoriteId }) => {
    return (
        await api.get('/favorite/check', { params: { userId, favoriteId } })
    ).data;
};
export const getFavorite = async ({ userId }) => {
    return (await api.get('/favorite', { params: { userId } })).data;
};
