import React, { useEffect, useState } from 'react';
import { getVelocityReport } from '../services/api';

const VelocityDashboard = ({ storeId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const report = await getVelocityReport(storeId);
        console.log('📦 Data received:', report);
        setData(report);
      } catch (error) {
        console.error('Failed to fetch velocity report:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [storeId]);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!data.length) return <p className="text-gray-500">No data available.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📊 Product Velocity Report</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">SKU</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Avg/Day</th>
              <th className="px-4 py-2 border">Days Since Last Sale</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => {
              const isSlow = item.avg_units_per_day < 0.2 && item.days_since_last_sale > 30;
              return (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">{item.sku}</td>
                  <td className="px-4 py-2">{item.title}</td>
                  <td className="px-4 py-2">{item.avg_units_per_day}</td>
                  <td className="px-4 py-2">{item.days_since_last_sale}</td>
                  <td className="px-4 py-2">
                    {isSlow ? (
                      <span className="text-yellow-600 font-semibold">⚠️ Slow-moving</span>
                    ) : (
                      <span className="text-green-600 font-semibold">✅ Fast-moving</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VelocityDashboard;
