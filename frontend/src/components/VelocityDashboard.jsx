import React, { useEffect, useState, useRef } from 'react';
import { unparse } from 'papaparse';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, startOfYear, endOfYear } from 'date-fns';

import { getVelocityReport } from '../services/api';
import VelocityChart from './VelocityChart';
import FastSlowVelocityChart from './FastSlowVelocityChart';
import Sidebar from './Sidebar';
import ProductSalesTrendChart from './ProductSalesTrendChart';



const VelocityDashboard = ({ storeId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [showSlowOnly, setShowSlowOnly] = useState(false);
  const [showFastOnly, setShowFastOnly] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const selectAllRef = useRef(null);
  const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [currentTab, setCurrentTab] = useState('Velocity Report');

  // Handle Fast and Slow product toggles
  const handleFastOnlyChange = (checked) => {
    setShowFastOnly(checked);
    setShowSlowOnly(false);
    setSelectedProducts([]); // 👈 clear selections
  };

  // Handle Slow product toggles
  const handleSlowOnlyChange = (checked) => {
    setShowSlowOnly(checked);
    setShowFastOnly(false);
    setSelectedProducts([]); // 👈 clear selections
  };

  // Filter fast and slow products
  console.log('🔍 Raw filtered data before categorizing:', filtered);
  const filteredArray = Array.isArray(filtered) ? filtered : [];
  const fastProducts = filteredArray.filter(
    item => item.avg_units_per_day >= 0.5 || item.days_since_last_sale <= 7
  );

  // Categorize slow products
  const slowProducts = filteredArray.filter(
    item => item.avg_units_per_day < 0.5 && item.days_since_last_sale > 15
  );
  console.log('⚡ Fast products:', fastProducts);
  console.log('🐢 Slow products:', slowProducts);

  const safeFiltered = Array.isArray(filtered) ? filtered : [];


  // Export Chart as CSV function
  const handleExportCSV = () => {
    const dataToExport =
      selectedProducts.length > 0
        ? selectedProducts
        : showFastOnly
          ? fastProducts
          : showSlowOnly
            ? slowProducts
            : [];

    if (dataToExport.length === 0) {
      alert('No data to export.');
      return;
    }

    // Format data for CSV export
    const formattedData = dataToExport.map(item => ({
      sku: item.sku,
      title: item.title,
      registered_date: item.registered_date ? new Date(item.registered_date).toISOString().split('T')[0]: '-', // Assuming this is a date field
      total_units_sold: item.total_units_sold,
      avg_units_per_day: item.avg_units_per_day,
      days_since_last_sale: item.days_since_last_sale,
      last_sale_date: item.last_sale_date ? new Date(item.last_sale_date).toISOString().split('T')[0]: '-',
      is_slow: item.is_slow ? 'Yes' : 'No',
    }));

    // Convert to CSV format
    const csv = unparse(formattedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'velocity_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Chart as PDF function
  const handleDownloadChartPDF = async () => {
    const chartElement = document.getElementById('velocity-chart');

    if (!chartElement) {
      alert('No chart to export!');
      return;
    }

    const canvas = await html2canvas(chartElement);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('velocity_chart.pdf');
  };

  // Fetch data from API
  const fetchData = async () => {
    const formattedStart = startDate ? format(startDate, 'yyyy-MM-dd') : null;
    const formattedEnd = endDate ? format(endDate, 'yyyy-MM-dd') : null;

    console.log('🛰️ Fetching with params:', { storeId, formattedStart, formattedEnd });

    try {
      const report = await getVelocityReport(storeId, formattedStart, formattedEnd);
      console.log('📦 Backend Data received:', report, formattedStart, formattedEnd);
      setData(report);
      console.log('🧪 Backend Data actually set into state:', report);
    } catch (error) {
      console.error('Failed to fetch Backend velocity report:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or when storeId, startDate, or endDate changes
  useEffect(() => {
    fetchData();
  }, [storeId, startDate, endDate]);


  // Filter data based on search input and fast/slow movers
  useEffect(() => {
    let results = Array.isArray(data) ? [...data] : [];

    if (search) {
      results = results.filter(
        item =>
          item.title?.toLowerCase().includes(search.toLowerCase()) ||
          item.sku?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (showSlowOnly) {
      results = results.filter(
        item => item.avg_units_per_day < 0.2 && item.days_since_last_sale > 30
      );
    } else if (showFastOnly) {
      results = results.filter(
        item => item.avg_units_per_day >= 0.2 || item.days_since_last_sale <= 30
      );
    }

    console.log('🔎 Filtered results:', results);
    setFiltered(results);
  }, [search, showSlowOnly, showFastOnly, data]);

  // Update the select all checkbox state based on selected products
    useEffect(() => {
      if (!selectAllRef.current) return;

      const allSelected = selectedProducts.length === filtered.length;
      const noneSelected = selectedProducts.length === 0;

      selectAllRef.current.indeterminate = !allSelected && !noneSelected;
    }, [selectedProducts, filtered]);


  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!data.length) return <p className="text-gray-500">No data available.</p>;
  console.log('✅ Final filtered products:', filtered);
  console.log('✅ All data from server:', data);



  return (
    <div className='flex h-screen'>
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1 p-6 overflow-y-auto bg-gray-50">

        <h2 className="text-xl font-bold mb-4">📦 Product Velocity Report</h2>

        {/* Filter/Search Bar */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <input
            type="text"
            placeholder="Search by SKU or title"
            className="border px-3 py-2 rounded w-full sm:w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Date Range Filter */}
          <div className="flex gap-4 items-end mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                className="border rounded px-3 py-2"
                placeholderText="Select start date"
                isClearable
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                className="border rounded px-3 py-2"
                placeholderText="Select end date"
                isClearable
              />
            </div>
            <button
              className="bg-gray-200 text-gray-800 px-3 py-2 rounded hover:bg-gray-300 transition"
              onClick={() => {
                setStartDate(startOfYear(new Date()));
                setEndDate(endOfYear(new Date()));
              }}
            >
              This Year
            </button>
          </div>

          {/* Advance option for Fast & Slow product chart */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showFastOnly}
              onChange={(e) => handleFastOnlyChange(e.target.checked)}
            />
            <span>Show fast movers only</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showSlowOnly}
              onChange={(e) => handleSlowOnlyChange(e.target.checked)}
            />
            <span>Show slow movers only</span>
          </label>
        </div>
        
        {/* Table */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">
            {selectedProducts.length > 0
              ? `${selectedProducts.length} of ${filtered.length} selected`
              : `No products selected`}
          </div>
      
          {selectedProducts.length > 0 && (
            <button
              onClick={() => setSelectedProducts([])}
              className="ml-4 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Deselect All
            </button>
          )}
        </div>
        {/* <div className="text-sm text-gray-600 mb-2">
          {selectedProducts.length > 0
            ? `${selectedProducts.length} of ${filtered.length} selected`
            : `No products selected`}
        </div> */}
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && selectedProducts.length === filtered.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProducts(filtered);
                    } else {
                      setSelectedProducts([]);
                    }
                  }}
                />
              </th>
              <th className="border px-4 py-2">SKU</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Registered Date</th>
              <th className="border px-4 py-2">Avg/Day</th>
              <th className="border px-4 py-2">Days Since Last Sale</th>
              <th className="border px-4 py-2">Tag</th>
            </tr>
          </thead>
          <tbody>
            {safeFiltered.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">No matching products</td>
              </tr>
            ) : (
              safeFiltered.map((item, i) => {
                const isSlow = item.avg_units_per_day < 0.5 && item.days_since_last_sale > 15;
                return (
                  <tr key={i} className="transition hover:bg-indigo-50">
                    <td className="border px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedProducts.some(p => p.sku === item.sku)}
                        onChange={() => {
                          const isSelected = selectedProducts.some(p => p.sku === item.sku);
                          if (isSelected) {
                            setSelectedProducts(selectedProducts.filter(p => p.sku !== item.sku));
                          } else {
                            setSelectedProducts([...selectedProducts, item]);
                          }
                        }}
                      />
                    </td>
                    <td className="border px-4 py-2">{item.sku}</td>
                    <td className="border px-4 py-2">{item.title}</td>
                    <td className="border px-4 py-2">{item.registered_date ? new Date(item.registered_date).toISOString().split('T')[0]: '-'}</td>
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
      
        {/* CHART for selected products */}
        <div id='velocity-chart'>
          {selectedProducts.length > 0 ? (
            <>
              <div className="text-indigo-700 font-medium mb-2">
                Showing chart for {selectedProducts.length} selected product{selectedProducts.length > 1 ? 's' : ''}.
              </div>
              <VelocityChart data={selectedProducts} />
            </>
          ) : showFastOnly ? (
            <>
              <div className="text-indigo-700 font-medium mb-2">
                Showing chart for {fastProducts.length} fast-moving product{fastProducts.length > 1 ? 's' : ''}.
              </div>
              <FastSlowVelocityChart data={fastProducts} />
            </>
          ) : showSlowOnly ? (
            <>
              <div className="text-indigo-700 font-medium mb-2">
                Showing chart for {slowProducts.length} slow-moving product{slowProducts.length > 1 ? 's' : ''}.
              </div>
              <FastSlowVelocityChart data={slowProducts} />
            </>
          ) : (
            <div className="text-gray-500 italic mb-2">
              Select products or apply a filter to view a chart 👆
            </div>
          )}
        </div>
        {/* {selectedProducts.length > 0 && (
          <VelocityChart data={selectedProducts} />
        )} */}
      
        {/* Clear selections button */}
        {selectedProducts.length > 0 && (
          <button
            onClick={() => setSelectedProducts([])}
            className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Clear the Chart
          </button>
        )}
        {/* Download CSV button */}
        <button
          onClick={handleExportCSV}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          📤 Download CSV
        </button>
        {/* Download PDF button */}
        <button
          onClick={handleDownloadChartPDF}
          className="ml-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          📄 Download Chart as PDF
        </button>
        
        {/* Product Sales Trend Chart */}
        <>
          <h3 className="text-lg font-bold mt-8 mb-2">📊 Monthly Sales Trends</h3>
          {selectedProducts.map((product, index) => (
            <ProductSalesTrendChart
              key={product.sku || index}
              data={[product]} // 👈 wrapped in array so your chart logic works
              title={product.title || product.sku}
            />
          ))}

        </>
        
      </main>
    </div>
  );
};


export default VelocityDashboard;
