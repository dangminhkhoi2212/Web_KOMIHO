import useApi from './apiConfig';
const api = useApi();

export const getRevenue = async (userId) => {
    return (await api.get('/statistic/analysis-seller', { params: { userId } }))
        .data;
};
export const getAnalysisAdmin = async () => {
    return (await api.get('/statistic/analysis-admin')).data;
};
export const getStatisticRevenue = async ({
    userId,
    filterDay,
    filterMonth,
    filterYear,
    filterBy = 'day',
}) => {
    return (
        await api.get('/statistic/analysis-revenue', {
            params: { userId, filterDay, filterMonth, filterYear, filterBy },
        })
    ).data;
};
