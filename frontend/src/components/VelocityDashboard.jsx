import React, { use, useEffect, useState } from 'react';
import { getVelocityReport } from '../services/api';

const VelocityDashboard = ({ storeId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [showSlowOnly, setShowSlowOnly] = useState(false);

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

  useEffect(() => {
    let results = data;

    // Search filter
    if (search) {
      results = results.filter(
        item =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.sku.toLowerCase().includes(search.toLowerCase())
      );
    }
  
    // Slow movers only filter
    if (showSlowOnly) {
      results = results.filter(
        item => item.avg_units_per_day < 0.2 && item.days_since_last_sale > 30
      )
    }

    setFiltered(results);
  }, [search, showSlowOnly, data]);


    if (loading) return <p className="text-gray-500">Loading...</p>;
    if (!data.length) return <p className="text-gray-500">No data available.</p>;

    return (
      <div className="p-4 max-w-5xl mx-auto">
        <h2 className="text-xl font-bold mb-4">📦 Product Velocity Report</h2>

        {/* Filter Bar */}
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <input
            type="text"
            placeholder="Search by SKU or title"
            className="border px-3 py-2 rounded w-full sm:w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showSlowOnly}
              onChange={(e) => setShowSlowOnly(e.target.checked)}
            />
            <span>Show slow movers only</span>
          </label>
        </div>

        {/* Table */}
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">SKU</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Avg/Day</th>
              <th className="border px-4 py-2">Days Since Last Sale</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">No matching products</td>
              </tr>
            ) : (
              filtered.map((item, i) => {
                const isSlow = item.avg_units_per_day < 0.2 && item.days_since_last_sale > 30;
                return (
                  <tr key={i}>
                    <td className="border px-4 py-2">{item.sku}</td>
                    <td className="border px-4 py-2">{item.title}</td>
                    <td className="border px-4 py-2">{item.avg_units_per_day}</td>
                    <td className="border px-4 py-2">{item.days_since_last_sale}</td>
                    <td className="border px-4 py-2">
                      {isSlow ? '⚠️ Slow-moving' : '✅ Fast-moving'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
  );
};


export default VelocityDashboard;
