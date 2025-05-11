require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('Shopify Sync App API is running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Shopify OAuth routes
const shopifyRoutes = require('./routes/shopify');
app.use('/api/shopify', shopifyRoutes);
