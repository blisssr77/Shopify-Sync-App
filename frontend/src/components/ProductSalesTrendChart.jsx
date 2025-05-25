import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

/**
 * Renders a monthly sales bar chart for a single product.
 * Props:
 * - data: Array of { month: '2024-01', total_units: 35 }
 * - title: String (Product name or SKU)
 */
export default function ProductSalesTrendChart({ data, title }) {
    console.log('📥 Received in ProductSalesTrendChart:', data);
    if (!Array.isArray(data) || data.length === 0) return null;

    const monthMap = {};

    data.forEach(product => {
    console.log('🔎 monthly_sales for', product.sku, product.monthly_sales);

    if (!Array.isArray(product.monthly_sales)) return;

    product.sale_date.forEach(sale => {
        if (!monthMap[sale.month]) {
        monthMap[sale.month] = 0;
        }
        monthMap[sale.month] += sale.units_sold;
    });
    });

    const chartData = Object.entries(monthMap).map(([month, total_units]) => ({
        month,
        total_units,
    }));

    if (chartData.length === 0) return null;

    return (
        <div className="w-full h-[300px] bg-white shadow rounded p-4 mb-6">
        <h3 className="text-md font-semibold mb-2">{title} - Monthly Sales</h3>
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_units" fill="#4f46e5" name="Units Sold" />
            </BarChart>
        </ResponsiveContainer>
        </div>
    );
}
