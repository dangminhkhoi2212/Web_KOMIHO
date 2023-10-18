import useApi from './apiConfig';
const api = useApi();

export const addFollower = async ({ userId, followerId }) => {
    return (await api.patch('/follow', { userId, followerId })).data;
};
export const checkFollow = async ({ userId, followerId }) => {
    return (await api.get('/follow/check', { params: { userId, followerId } }))
        .data;
};
export const getFollow = async ({ userId, status }) => {
    return (await api.get('/follow', { params: { userId, status } })).data;
};
