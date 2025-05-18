import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5050/api',
});

export const getVelocityReport = async (storeId) => {
    const response = await API.get(`/analytics/velocity?store_id=${storeId}`);
    return response.data.data;
};