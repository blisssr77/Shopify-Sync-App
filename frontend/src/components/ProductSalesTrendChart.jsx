import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList
} from 'recharts';
import { unparse } from 'papaparse';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// This chart shows monthly total units sold per product SKU

const ProductSalesTrendChart = ({ data, title }) => {
    console.log('📥 Received in ProductSalesTrendChart:', data);
    if (!Array.isArray(data) || data.length === 0) return null;

    // Group monthly sales by month across the given product data
    const monthMap = {};

    data.forEach(product => {
    console.log('🔎 monthly_sales for', product.sku, product.monthly_sales);

    if (!Array.isArray(product.monthly_sales)) return;

    product.monthly_sales.forEach(sale => {
        if (!monthMap[sale.month]) {
            monthMap[sale.month] = 0;
        }
        monthMap[sale.month] += sale.units_sold;
    });
    });

    // Convert map to chart-friendly array
    const chartData = Object.entries(monthMap).map(([month, total_units]) => ({
        month,
        total_units,
    }));

    const sku = data[0]?.sku || '';
    const chartId = `monthly-sales-chart-${sku}`;

    // CSV Export Functionality
    const handleExportCSV = () => {
        const csv = unparse(chartData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${sku || 'monthly'}_sales.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    // PDF Export Functionality
    const handleExportPDF = async () => {
        const chartElement = document.getElementById(chartId);
        if (!chartElement) return;

        const canvas = await html2canvas(chartElement);
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${sku || 'monthly'}_sales.pdf`);
    };

    // Render nothing if no data
    if (chartData.length === 0) return null;

    return (
        <div className="bg-white p-4 rounded-xl shadow mt-8">
            <h3 className="text-md font-semibold mb-4">
            📅 Monthly Sales - {data[0]?.sku ? `${data[0].sku} ${title}` : title || 'Selected Products'}
            </h3>

            <ResponsiveContainer width="100%" height={350}>
            <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                dataKey="month"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={60}
                label={{ value: 'Month', position: 'insideBottom', offset: -20 }}
                />
                <YAxis
                label={{ value: 'Units Sold', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                formatter={(value) => [`${value} units`, 'Total Sold']}
                cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="total_units" fill="#14b8a6" name="Units Sold">
                <LabelList dataKey="total_units" position="top" />
                </Bar>
            </BarChart>
            </ResponsiveContainer>
            {/* Export Buttons */}
            <div className="flex gap-2 mt-4">
                <button
                onClick={handleExportCSV}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                📤 Download CSV
                </button>
                <button
                onClick={handleExportPDF}
                className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                >
                📄 Download Chart as PDF
                </button>
            </div>
        </div>
    );
};

export default ProductSalesTrendChart;

// 💡 This component aggregates monthly sales from all selected SKUs and renders them in a grouped bar chart.
