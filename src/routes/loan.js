const express = require('express');
const { applyForLoan, getLoanStatus, initiatePayment, automaticDeduction } = require('../controllers/loan');

const router = express.Router();

router.post('/apply', applyForLoan);
router.get('/:id/status', getLoanStatus);
router.post('/initiate-payment', initiatePayment);
router.post('/automatic-deduction', automaticDeduction);

module.exports = router;