'use client';
import axios from 'axios';

const config = {
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },
};
const apiConfig = (baseURL) => axios.create({ baseURL, ...config });
export default apiConfig;
