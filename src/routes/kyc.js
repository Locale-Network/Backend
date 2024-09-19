const express = require('express');
const { getAccount, createLinkToken, exchangePublicToken } = require('../controllers/kyc');

const router = express.Router();

router.post('/account', getAccount);
router.post('/create-link-token', createLinkToken);
router.post('/exchange-public-token', exchangePublicToken);

module.exports = router;