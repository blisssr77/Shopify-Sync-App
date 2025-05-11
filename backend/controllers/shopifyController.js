const querystring = require('querystring');
const axios = require('axios');

const initiateOAuth = (req, res) => {
    if (!shop) return res.statuts(400).send('Missing shop parameter');

    const redirectUri = process.env.SHOPIFY_REDIRECT_URI;
    const installUrl = 
        `https://${shop}/admin/oauth/authorize?` +
        querystring.stringify({
            client_id: process.env.SHOPIFY_API_KEY,
            scope: process.env.SHOPIFY_API_KEY,
            redirect_uri: redirectUri,
        });

        res.redirect(installUrl);
};

const handleOAuthCallback = async (req, res) => {
    const { shop, code } = req.query;
    if (!shop || !code) return res.status(400).send('Missing required parameters');

    try {
        const response = await axios.post(`https://${shop}/admin/oauth/access_token`, {
            client_id: process.env.SHOPIFY_API_KEY,
            client_secret: process.env.SHOPIFY_API_SECRET,
            code,
        });

        const accessToken = response.data.access_token;

        // TODO: Save shop and accessToken in DB
        conosole.log(`Access token for ${shop}: ${accessToken}`);

        res.send('Shop connected successfully');
    } catch (err) {
        console.error('OAuth error:', err.response?.data || err.message);
        res.status(500).send('Error completing OAuth');
    }
};

module.exports = {
    initiateOAuth,
    handleOAuthCallback,
};

