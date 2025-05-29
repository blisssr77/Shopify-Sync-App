const { createClient } = require('@supabase/supabase-js');

// Use your real Supabase credentials from the environment variables
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * Retrieves and aggregates sales data for velocity report using Supabase
 */
async function getProductVelocityReport(storeId, startDate, endDate) {
  try {
    // Step 1: fetch raw sales rows for the store
    const { data: rawData, error } = await supabase
      .from('sales_reports')
      .select('*')
      .eq('store_id', storeId)
      .gte('sale_date', startDate)
      .lte('sale_date', endDate);

    if (error) throw error;

    // Step 2: group by SKU and build monthly sales
    const monthlySalesMap = {};

    rawData.forEach((row) => {
      const month = row.sale_date.slice(0, 7);
      const key = `${row.sku}_${month}`;

      if (!monthlySalesMap[row.sku]) {
        monthlySalesMap[row.sku] = {};
      }

      if (!monthlySalesMap[row.sku][month]) {
        monthlySalesMap[row.sku][month] = 0;
      }

      monthlySalesMap[row.sku][month] += row.units_sold;
    });

    // Step 3: merge into products
    const products = {};

    rawData.forEach((row) => {
      if (!products[row.sku]) {
        products[row.sku] = {
          sku: row.sku,
          title: row.title,
          registered_date: row.registered_date,
          total_units_sold: 0,
          total_sales_events: 0,
          last_sale_date: row.sale_date,
          monthly_sales: []
        };
      }

      products[row.sku].total_units_sold += row.units_sold;
      products[row.sku].total_sales_events += 1;

      if (new Date(row.sale_date) > new Date(products[row.sku].last_sale_date)) {
        products[row.sku].last_sale_date = row.sale_date;
      }
    });

    // Step 4: attach monthly sales to each product
    for (const sku in products) {
      const monthEntries = monthlySalesMap[sku] || {};
      products[sku].monthly_sales = Object.entries(monthEntries).map(([month, units_sold]) => ({
        month,
        units_sold
      }));
    }

    // Step 5: finalize result
    const today = new Date();
    const result = Object.values(products).map(product => {
      const daysSinceLastSale = Math.floor((today - new Date(product.last_sale_date)) / (1000 * 60 * 60 * 24));
      const daysSinceFirstSale = Math.max((today - new Date(product.registered_date)) / (1000 * 60 * 60 * 24), 1);
      
      return {
        ...product,
        days_since_last_sale: daysSinceLastSale,
        avg_units_per_day: (product.total_units_sold / daysSinceFirstSale).toFixed(2)
      };
    });

    return result;
  } catch (err) {
    console.error('❌ Supabase velocity query error:', err.message);
    return [];
  }
}

module.exports = {
  getProductVelocityReport,
};

