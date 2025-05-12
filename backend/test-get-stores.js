const { getAllStores } = require('./services/shopifyService');
require('dotenv').config();

(async () => {
  const stores = await getAllStores();
  if (stores.length > 0) {
    console.log('✅ Connected Stores:');
    stores.forEach((store, i) => {
      console.log(`${i + 1}. ${store.shop} (added: ${store.created_at})`);
    });
  } else {
    console.log('⚠️ No connected stores found.');
  }
})();