const {
  getProductVelocityReport
} = require('../services/analyticsService');

async function getVelocityReport(req, res) {
  const storeId = req.query.store_id;

  console.log('📥 Incoming request to /api/analytics/velocity');
  console.log('🔍 Received store_id:', storeId);

  if (!storeId) {
    console.log('⚠️ Missing store_id!');
    return res.status(400).json({ error: 'Missing store_id in query' });
  }

  try {
    const report = await getProductVelocityReport(storeId);
    console.log('📦 Report generated:', report.length, 'items');
    res.json({ data: report });
  } catch (err) {
    console.error('❌ Error generating product velocity report:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports = { getVelocityReport };
