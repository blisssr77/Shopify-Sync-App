const express = require('express');
const router = express.Router();
const { getVelocityData } = require('../controllers/analyticsController');

// GET /api/analytics/velocity?store_id=123
router.get('/velocity', getVelocityData);

module.exports = router;
