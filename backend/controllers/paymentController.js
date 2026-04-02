const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private/User
exports.createOrder = async (req, res, next) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        
        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'dummy_id',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
        });

        const options = {
            amount: booking.totalPrice * 100, // exact paise
            currency: 'INR',
            receipt: `receipt_order_${booking._id}`,
        };

        const order = await instance.orders.create(options);

        // Pre-commit booking context
        booking.paymentId = order.id;
        await booking.save();

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Verify Razorpay payment logic
// @route   POST /api/payments/webhook
// @access  Public
exports.verifyPayment = async (req, res, next) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';
        
        // Generate our own local HMAC hashed from the raw body using the secret
        const shasum = crypto.createHmac('sha256', secret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');

        if (digest === req.headers['x-razorpay-signature']) {
            // Webhook payload validated! Parse event
            const paymentId = req.body.payload.payment.entity.order_id;
            
            const booking = await Booking.findOne({ paymentId });
            if (booking) {
                booking.isPaid = true;
                booking.status = 'completed'; // Ensure booking aligns
                
                // 20% math!
                const commission = booking.totalPrice * 0.20;
                booking.adminCommission = Math.round(commission);
                booking.guidePayout = booking.totalPrice - booking.adminCommission;
                
                await booking.save();
                return res.status(200).json({ status: 'ok' });
            }
        }
        
        res.status(400).json({ status: 'invalid signature' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
