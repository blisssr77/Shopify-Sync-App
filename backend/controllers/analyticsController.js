const {
  getProductVelocityReport
} = require('../services/analyticsService');

/**
 * GET /api/analytics/velocity
 * Returns velocity report for a specific store
 */
async function getVelocityData(req, res) {
  const storeId = req.query.store_id;

  if (!storeId) {
    return res.status(400).json({ error: 'Missing store_id in query' });
  }

  try {
    const report = await getProductVelocityReport(storeId);
    res.json({ data: report });
  } catch (err) {
    console.error('❌ Error in getVelocityData:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getVelocityData };
