import useApi from '@/services/apiConfig';
const api = useApi();

export const uploadImages = async (data) => {
    return (
        await api.post('/image/upload-images', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    ).data;
};
export const deleteImages = async (data) => {
    return (await api.post('/image/delete-images', data)).data;
};
