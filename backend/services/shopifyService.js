const { Pool } = require('pg');
const pool = new Pool(); // Add config or use environment variables

async function saveShopToken(shop, accessToken) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO stores (shop, access_token) VALUES ($1, $2) ON CONFLICT (shop) DO UPDATE SET access_token = $2 RETURNING *',
      [shop, accessToken]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

module.exports = { saveShopToken };

/**
 * Fetches all connected Shopify stores from the databse
 * @returns {Array} List of store records
 */
async function getAllStores() {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM stores ORDER BY created_at DESC');
        return result.rows;
    } catch (err) {
        console.error('Error fetching stores:', err.message);
        return [];
    } finally {
        client.release();
    }
}

module.exports = {
    saveShopToken,
    getAllStores,
};