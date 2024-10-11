const express = require('express');
const router = express.Router();
const controller = require('../controllers/vnpayController');
const {referrerPolicy } = require('../middlewares/corsMiddleware')

router.post('/create-payment_url', referrerPolicy, controller.createPaymentUrl)
router.get('/vnpay_return', referrerPolicy, controller.vnpayReturn)

module.exports = router
