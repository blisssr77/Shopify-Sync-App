const express = require('express');
const router = express.Router();
const {
    initiateOAuth,
    handleOAuthCallback,
} = require('../controllers/shopifyController');

router.get('/connect', initiateOAuth);
router.get('/callback', handleOAuthCallback);

module.exports = router;
