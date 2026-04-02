const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Order creation belongs to the User paying
router.post('/create-order', protect, createOrder);

// Webhook arrives freely from Razorpay servers and verifies signature natively
router.post('/webhook', verifyPayment);

module.exports = router;
