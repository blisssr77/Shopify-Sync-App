import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const { store_id, start_date, end_date } = req.query;

  console.log('📥 Supabase API Hit');
  console.log('Store:', store_id, 'Date:', start_date, '→', end_date);

  try {
    // Step 1: Fetch base data
    const { data: baseData, error: baseError } = await supabase
      .from('sales_reports')
      .select('*')
      .eq('store_id', store_id)
      .gte('sale_date', start_date)
      .lte('sale_date', end_date);

      console.log('🧾 Raw Supabase data:', baseData);
      console.log('❌ Supabase error (if any):', baseError);

    if (baseError) throw baseError;

    // Step 2: Aggregate monthly sales per SKU
    const monthMap = {};

    baseData.forEach((item) => {
      const month = item.sale_date.slice(0, 7); // "YYYY-MM"
      const key = `${item.sku}_${month}`;
      if (!monthMap[key]) {
        monthMap[key] = {
          sku: item.sku,
          month,
          units_sold: 0,
        };
      }
      monthMap[key].units_sold += item.units_sold;
    });

    const monthlyData = Object.values(monthMap);

    // Step 3: Merge into per-product result
    const skus = [...new Set(baseData.map(item => item.sku))];

    const result = skus.map(sku => {
      const productEntries = baseData.filter(item => item.sku === sku);
      const monthly_sales = monthlyData.filter(ms => ms.sku === sku);
      const total_units = productEntries.reduce((sum, p) => sum + p.units_sold, 0);
      const firstSale = productEntries[0];

      return {
        sku,
        title: firstSale.title,
        registered_date: firstSale.registered_date,
        total_units_sold: total_units,
        avg_units_per_day: total_units / 365,
        last_sale_date: firstSale.sale_date,
        days_since_last_sale: Math.floor((new Date() - new Date(firstSale.sale_date)) / (1000 * 60 * 60 * 24)),
        monthly_sales,
      };
    });

    return res.status(200).json({ data: result });
  } catch (error) {
    console.error('❌ Supabase error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// console.log('✅ velocity.js loaded');


// export default async function handler(req, res) {
//   console.log('🚀 velocity handler triggered');
//   const { store_id, start_date, end_date } = req.query;
//   console.log('📥 Query Params:', { store_id, start_date, end_date });

//   try {
//     // Fetch all sales data within date range
//     const { data: baseData, error: baseError } = await supabase
//       .from('sales_reports')
//       .select('*')
//       .eq('store_id', store_id)
//       .gte('sale_date', start_date)
//       .lte('sale_date', end_date);

//       console.log('🔍 Received store_id:--->>>', store_id);
//       console.log('📦 baseData:', baseData);



//     if (baseError) throw baseError;

//     // Get all unique SKUs
//     const skus = [...new Set(baseData.map(item => item.sku))];

//     // Group monthly sales in JS
//     const monthlyDataMap = {};

//     for (const item of baseData) {
//       const month = item.sale_date.slice(0, 7); // "YYYY-MM"
//       const key = `${item.sku}_${month}`;

//       if (!monthlyDataMap[key]) {
//         monthlyDataMap[key] = {
//           sku: item.sku,
//           month,
//           units_sold: 0,
//         };
//       }

//       monthlyDataMap[key].units_sold += item.units_sold;
//     }

//     const monthlyData = Object.values(monthlyDataMap);
//     console.log('📊 monthlyData generated:', monthlyData);


//     // Merge monthly data into each product
//     const result = skus.map(sku => {
//       const monthly_sales = monthlyData
//         .filter(row => row.sku === sku)
//         .sort((a, b) => new Date(a.month) - new Date(b.month));

//       const sampleProduct = baseData.find(p => p.sku === sku) || { sku };


//       return {
//         ...sampleProduct,
//         monthly_sales, // attach sales trend
//       };
//     });

//     return res.status(200).json({ data: result });
//   } catch (error) {
//     console.error('❌ Velocity API error:', error.message);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// }
