import useApi from './apiConfig';
const api = useApi();

export const getStatistic = async (userId) => {
    return (await api.get('/statistic/analysis-seller', { params: { userId } }))
        .data;
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
