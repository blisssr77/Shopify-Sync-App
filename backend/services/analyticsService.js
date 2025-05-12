const { Pool } = require('pg');
const pool = new Pool();

/**
 * Aggregates sales data to determine fast and slow moving products
 * - Uses SKU to group products
 * - Calculates total units sold, average per day, last sale date, and days since last sale
 */
async function getProductVelocityReport(storeId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      SELECT 
        sku,
        title,
        SUM(quantity) AS total_units_sold,
        COUNT(*) AS total_sales_events,
        MAX(sale_date) AS last_sale_date,
        CURRENT_DATE - MAX(sale_date) AS days_since_last_sale,
        ROUND(SUM(quantity) / GREATEST((CURRENT_DATE - MIN(sale_date)), 1), 2) AS avg_units_per_day
      FROM sales_reports
      WHERE store_id = $1
      GROUP BY sku, title
      ORDER BY avg_units_per_day DESC
      `,
      [storeId]
    );

    return result.rows;
  } catch (err) {
    console.error('❌ Error generating product velocity report:', err.message);
    return [];
  } finally {
    client.release();
  }
}

module.exports = { 
    getProductVelocityReport 
};
