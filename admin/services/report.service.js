import useApi from './apiConfig';
const api = useApi();

export const updateReport = async ({ reportId, isHandle }) => {
    return (await api.patch('/report', { reportId, isHandle })).data;
};
export const getReports = async () => {
    return (await api.get('/report')).data;
};
