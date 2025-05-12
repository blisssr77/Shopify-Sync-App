const axios = require('axios');
const { Pool } = require('pg');
const pool = new Pool();

/**
 * Fetches orders from Shopify Orders API
 * @param {string} shop - The Shopify store domain (e.g. 'test.myshopify.com')
 * @param {string} accessToken - The stored Shopify access token
 * @returns {Array} - List of order objects
 */
async function fetchOrders(shop, accessToken) {
    try {
        const response = await axios.get(`https://${shop}/admin/api/2023-10/orders.json`, {
            headers: {
                'X-Shopify-Access-Token': accessToken,
            },
            params: {
                status: 'any', // Fetch all orders regardless of status
                limit: 250, // Maximum number of orders per request
                page_info: '', // Pagination token for fetching more orders
            }
        });

        return response.data.orders;
    } catch (err) {
        console.error('Error fetching orders:', err.message);
        return [];
    }
}

/**
 * Parses orders and saves sales data into the DB
 * @param {string} storeId - UUID of the connected store
 * @param {Array} orders - Shopify orders with line items
 */
async function saveSalesFromOrders(storeId, orders) {
  const client = await pool.connect();

  try {
    for (const order of orders) {
      const saleDate = order.created_at.slice(0, 10); // Get YYYY-MM-DD

      for (const item of order.line_items) {
        await client.query(
          `INSERT INTO sales_reports (store_id, product_id, sku, title, quantity, sale_date)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            storeId,
            item.product_id,
            item.sku,
            item.title,
            item.quantity,
            saleDate,
          ]
        );
      }
    }
  } catch (err) {
    console.error('Failed to save sales data:', err.message);
  } finally {
    client.release();
  }
}

module.exports = { 
    fetchOrders, 
    saveSalesFromOrders 
};