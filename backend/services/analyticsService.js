const { createClient } = require('@supabase/supabase-js');

// Use your real Supabase credentials from the environment variables
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * Retrieves and aggregates sales data for velocity report using Supabase
 */
async function getProductVelocityReport(storeId, startDate, endDate) {
  try {
    const { data: rawData, error } = await supabase
      .from('sales_reports')
      .select('*')
      .eq('store_id', storeId)
      .gte('sale_date', startDate)
      .lte('sale_date', endDate);

    if (error) throw error;
    if (!rawData || rawData.length === 0) return [];

    const grouped = {};

    for (const row of rawData) {
      const key = row.sku;
      if (!grouped[key]) {
        grouped[key] = {
          sku: row.sku,
          title: row.title,
          registered_date: row.registered_date,
          total_units_sold: 0,
          total_sales_events: 0,
          last_sale_date: row.sale_date,
        };
      }

      grouped[key].total_units_sold += row.units_sold;
      grouped[key].total_sales_events += 1;

      if (new Date(row.sale_date) > new Date(grouped[key].last_sale_date)) {
        grouped[key].last_sale_date = row.sale_date;
      }
    }

    const today = new Date();

    const result = Object.values(grouped).map((product) => {
      const daysSinceLastSale = Math.floor(
        (today - new Date(product.last_sale_date)) / (1000 * 60 * 60 * 24)
      );
      const daysSinceFirstSale = Math.max(
        (today - new Date(product.registered_date)) / (1000 * 60 * 60 * 24),
        1
      );
      return {
        ...product,
        days_since_last_sale: daysSinceLastSale,
        avg_units_per_day: (
          product.total_units_sold / daysSinceFirstSale
        ).toFixed(2),
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


// const { Pool } = require('pg');
// const pool = new Pool();

// /**
//  * Aggregates sales data to determine fast and slow moving products
//  * - Uses SKU to group products
//  * - Calculates total units sold, average per day, last sale date, and days since last sale
//  */
// async function getProductVelocityReport(storeId, startDate, endDate) {
//   const client = await pool.connect();
//   try {
//     const result = await client.query(
//       `
//       SELECT 
//         sku,
//         title,
//         MIN(registered_date) AS registered_date,
//         SUM(units_sold) AS total_units_sold,
//         COUNT(*) AS total_sales_events,
//         MAX(sale_date) AS last_sale_date,
//         CURRENT_DATE - MAX(sale_date) AS days_since_last_sale,
//         ROUND(SUM(units_sold) / GREATEST((CURRENT_DATE - MIN(sale_date)), 1), 2) AS avg_units_per_day
//       FROM sales_reports
//       WHERE store_id = $1
//       AND sale_date BETWEEN $2 AND $3
//       GROUP BY sku, title, registered_date
//       ORDER BY avg_units_per_day DESC
//       `,
//       [storeId, startDate, endDate]
//     );

//     return result.rows;
//   } catch (err) {
//     console.error('❌ Error generating product velocity report:', err.message);
//     return [];
//   } finally {
//     client.release();
//   }
// }


// /**
//  * Stores the velocity report in the product_velocity table
//  * Clears previous entries for this store before saving
//  */
// async function saveVelocityReportToDB(storeId, velocityData) {
//   const client = await pool.connect();
//   try {
//     // Clear old report for the store
//     await client.query('DELETE FROM product_velocity WHERE store_id = $1', [storeId]);

//     // Insert new report
//     for (const item of velocityData) {
//       const isSlow = item.avg_units_per_day < 0.5 && item.days_since_last_sale > 15;

//       await client.query(
//         `INSERT INTO product_velocity 
//           (store_id, sku, title, total_units_sold, avg_units_per_day, last_sale_date, days_since_last_sale, is_slow, registered_date)
//          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
//         [
//           storeId,
//           item.sku,
//           item.title,
//           item.total_units_sold,
//           item.avg_units_per_day,
//           item.last_sale_date,
//           item.days_since_last_sale,
//           item.registered_date,
//           isSlow,
//         ]
//       );
//     }
//   } catch (err) {
//     console.error('❌ Error saving velocity report:', err.message);
//   } finally {
//     client.release();
//   }
// }

// module.exports = {
//   getProductVelocityReport,
//   saveVelocityReportToDB
// };

