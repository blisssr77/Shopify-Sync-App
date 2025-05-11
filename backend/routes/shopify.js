const express = require('express');
const router = express.Router();
const {
    initialOAuth,
    handleOAuthCallback,
} = require('../controllers/shopifyController');

router.get('/connect', initiateOAuth);
router.get('/callback', handleOAuthCallback);

module.exports = router;