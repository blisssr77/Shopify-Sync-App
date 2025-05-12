const { getProductVelocityReport } = require('./services/analyticsService');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool();

(async () => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM stores LIMIT 1');
    const store = result.rows[0];

    const report = await getProductVelocityReport(store.id);
    console.log('📊 Product Velocity Report:\n');
    report.forEach((item, index) => {
      const isSlow = item.avg_units_per_day < 0.2 && item.days_since_last_sale > 30;

      console.log(`${index + 1}. ${item.sku} (${item.title})`);
      console.log(`   Total Sold: ${item.total_units_sold}`);
      console.log(`   Avg/Day: ${item.avg_units_per_day}`);
      console.log(`   Last Sale: ${item.last_sale_date}`);
      console.log(`   Days Since Last: ${item.days_since_last_sale}`);
      if (isSlow) {
        console.log(`   ⚠️ Suggest: Promote or Bundle (slow-moving)\n`);
      } else {
        console.log(`   ✅ Fast-moving product\n`);
      }
    });
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    client.release();
    pool.end();
  }
})();
