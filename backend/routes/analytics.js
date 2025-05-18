const express = require('express');
const router = express.Router();
const { getVelocityReport } = require('../controllers/analyticsController');

// GET /api/analytics/velocity?store_id=123
router.get('/velocity', getVelocityReport);

module.exports = router;
