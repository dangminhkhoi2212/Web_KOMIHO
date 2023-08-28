import axios from 'axios';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
};
const useApi = () => {
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
        headers,
    });

    instance.interceptors.request.use(
        (config) => {
            if (!config.headers['Authorization']) {
                const accessToken = localStorage.getItem('accessToken');
                if (accessToken) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                }
            }
            // console.log('🚀 ~ file: useApi.js:14 ~ CONFIG REQUEST:', config);
            return config;
        },
        (error) => {
            return Promise.reject(error);
        },
    );

    instance.interceptors.response.use(
        (response) => {
            // console.log(
            //     '🚀 ~ file: useApi.js:34 ~ useApi ~ response:',
            //     response,
            // );
            return response;
        },
        async (error) => {
            // console.log('🚀 ~ file: useApi.js:41 ~ CONFIG ERROR:', error);
            const { response, config } = error;
            const status = response?.status;
            if (
                status === 403 &&
                localStorage.getItem('refreshToken') &&
                response.data.message === 'Invalid token'
            ) {
                const refreshTokenLocal = localStorage.getItem('refreshToken');
                try {
                    const { accessToken, refreshToken } = (
                        await instance.post(`/refreshToken`, {
                            refreshToken: refreshTokenLocal,
                        })
                    ).data;

                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);

                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                    // console.log('🚀 ~ file: useApi.js:69 ~ config:', config);

                    return Promise.resolve(instance.request(config));
                } catch (error) {
                    return Promise.reject(error);
                }
            }
            // Handle errors
            return Promise.reject(error);
        },
    );

    return instance;
};

export default useApi;
