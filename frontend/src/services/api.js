import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5050/api',
});

export const getVelocityReport = async (storeId, startDate, endDate) => {
    const response = await API.get(
        `/analytics/velocity?store_id=${storeId}&start_date=${startDate}&end_date=${endDate}`
    );
    return response.data.data;
};