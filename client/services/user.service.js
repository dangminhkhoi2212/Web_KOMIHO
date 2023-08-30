import useApi from './apiConfig';
const api = useApi();

export const updateProfile = async (userId, data) => {
    return (
        await api.put(`/user/update/profile/${userId}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    ).data;
};
export const updateAddress = async (userId, data) => {
    return (await api.put(`/user/update/address/${userId}`, data)).data;
};
export const deleteUser = async (userId, password) => {
    return (await api.post(`/user/${userId}`, { password })).data;
};
export const getUserApi = async (userId) => {
    return (await api.get(`/user/${userId}`)).data;
};