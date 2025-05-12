const { saveShopToken } = require('./services/shopifyService');
require('dotenv').config(); // Load .env
const { Pool } = require('pg'); // Ensure pg is loaded in context

// Simulated test values
const testShop = 'dev-store.myshopify.com';
const testToken = 'shpat_fake_token_for_test';

(async () => {
  try {
    const result = await saveShopToken(testShop, testToken);
    if (result) {
      console.log('Token saved successfully:', result);
    } else {
      console.log('Token not saved. Check error logs.');
    }
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
})();