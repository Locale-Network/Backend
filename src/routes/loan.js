const express = require('express');
const { applyForLoan, getLoanStatus } = require('../controller/loan');

const router = express.Router();

router.post('/apply', applyForLoan);
router.get('/:id/status', getLoanStatus);

module.exports = router;