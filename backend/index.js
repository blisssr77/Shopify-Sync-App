require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('Shopify Sync App API is running!');
});

// Start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Shopify OAuth routes
const shopifyRoutes = require('./routes/shopify');
app.use('/api/shopify', shopifyRoutes);

// Analytics routes
const analyticsRoutes = require('./routes/analytics');
app.use('/api/analytics', analyticsRoutes);