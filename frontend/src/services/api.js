import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5050/api',
});

export const getVelocityReport = async (storeId, startDate, endDate) => {
  console.log('🛰️ Fetching velocity report with:', { storeId, startDate, endDate });

  try {
    const response = await API.get('/analytics/velocity', {
      params: {
        store_id: storeId,
        start_date: startDate,
        end_date: endDate,
      },
    });

    // ✅ Return just the data (assuming the structure is { data: { data: [...] } })
    return response.data.data;
  } catch (error) {
    console.error('❌ Error fetching velocity report:', error);
    throw error;
  }
};

