import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  CartesianGrid
} from 'recharts';

// This component visualizes the 'Average units sold per day for each SKU' in a bar chart format.

const VelocityChart = ({ data }) => {
  const chartData = data.map(item => ({
    sku: item.sku,
    avgUnitsPerDay: item.avg_units_per_day
  }));

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-8">
      <h3 className="text-lg font-semibold mb-4">📊 Average Units Sold Per Day by SKU</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="sku"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={60}
            label={{ value: 'SKU', position: 'insideBottom', offset: -20 }}
          />
          <YAxis
            label={{ value: 'Units per Day', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value) => [`${value} units/day`, 'Avg Sold']}
            cursor={{ fill: '#f1f5f9' }}
          />
          <Bar dataKey="avgUnitsPerDay" fill="#4f46e5">
            <LabelList dataKey="avgUnitsPerDay" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VelocityChart;
// This component is a simple bar chart that visualizes the average units sold per day for each SKU.