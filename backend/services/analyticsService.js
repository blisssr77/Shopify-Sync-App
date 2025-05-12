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


/**
 * Stores the velocity report in the product_velocity table
 * Clears previous entries for this store before saving
 */
async function saveVelocityReportToDB(storeId, velocityData) {
  const client = await pool.connect();
  try {
    // Clear old report for the store
    await client.query('DELETE FROM product_velocity WHERE store_id = $1', [storeId]);

    // Insert new report
    for (const item of velocityData) {
      const isSlow = item.avg_units_per_day < 0.2 && item.days_since_last_sale > 30;

      await client.query(
        `INSERT INTO product_velocity 
          (store_id, sku, title, total_units_sold, avg_units_per_day, last_sale_date, days_since_last_sale, is_slow)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          storeId,
          item.sku,
          item.title,
          item.total_units_sold,
          item.avg_units_per_day,
          item.last_sale_date,
          item.days_since_last_sale,
          isSlow,
        ]
      );
    }
  } catch (err) {
    console.error('❌ Error saving velocity report:', err.message);
  } finally {
    client.release();
  }
}

module.exports = {
  getProductVelocityReport,
  saveVelocityReportToDB
};

