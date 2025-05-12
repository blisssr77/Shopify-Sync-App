const { fetchOrders, saveSalesFromOrders } = require('./services/salesService');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool();

(async () => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM stores LIMIT 1');
    const store = result.rows[0];

    const orders = await fetchOrders(store.shop, store.access_token);
    console.log(`Fetched ${orders.length} orders from ${store.shop}`);

    await saveSalesFromOrders(store.id, orders);
    console.log('✅ Sales data saved to database.');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    client.release();
    pool.end();
  }
})();
