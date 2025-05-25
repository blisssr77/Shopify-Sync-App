const {
  getProductVelocityReport
} = require('../services/analyticsService');

async function getVelocityReport(req, res) {
  const storeId = req.query.store_id;
  const startDate = req.query.start_date || '2000-01-01';
  const endDate = req.query.end_date || '2100-01-01'; 

  // Default to the current date if no end date is provided

  console.log('📥 Incoming request to /api/analytics/velocity');
  console.log('🔍 Received store_id:', storeId);
  console.log(`Generating report from ${startDate} to ${endDate} for store ${storeId}`);


  if (!storeId) {
    console.log('⚠️ Missing store_id!');
    return res.status(400).json({ error: 'Missing store_id in query' });
  }
  // Save the report to the database
  try {
    const report = await getProductVelocityReport(storeId, startDate, endDate);
    if (!report || report.length === 0) {
      console.log('⚠️ No data found for store_id:', storeId);
      return res.status(404).json({ error: 'No data found for the given store_id' });
    }
    console.log('📦 Report generated:', report.length, 'items');
    res.json({ data: report });
  } catch (err) {
    console.error('❌ Error generating product velocity report:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports = { getVelocityReport };
