import useApi from './apiConfig';
const api = useApi();
export const sendMail = async (to, subject, html) => {
    return (await api.post('/service/email', { to, subject, html })).data;
};
