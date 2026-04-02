const http = require('http');
const crypto = require('crypto');

async function testPhase6() {
    const port = 3000;
    
    // Helper to send HTTP requests cleanly
    const jsonReq = (path, method, body, token, headers = {}) => new Promise((resolve) => {
        const payload = body ? JSON.stringify(body) : '';
        const req = http.request({
            hostname: 'localhost', port, path, method,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                ...headers
            }
        }, res => {
            let data = ''; res.on('data', d => data += d);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    console.error('Failed JSON decode over path:', path, 'Data:', data);
                    process.exit(1);
                }
            });
        }); 
        if (payload) req.write(payload); 
        req.end();
    });

    // 1. Get tokens and location
    const userCtx = await jsonReq('/api/auth/test-login', 'POST', { role: 'user' });
    const locRes = await jsonReq('/api/locations', 'GET');
    const locId = locRes.data[0]._id;

    console.log(`[USER] Simulated User Token Generated. Target Location: ${locId}`);

    // 2. Create the Booking
    const bookingRes = await jsonReq('/api/bookings/create', 'POST', { locationId: locId, lat: 20.1, lng: 85.1 }, userCtx.token);
    
    if (!bookingRes.success) {
        console.error('Booking failed:', bookingRes);
        process.exit(1);
    }
    
    const bookingId = bookingRes.data._id;
    console.log(`[USER] Booking Created: ${bookingId}. Total Price: ${bookingRes.data.totalPrice}`);

    // 3. Generate Razorpay Order
    const orderRes = await jsonReq('/api/payments/create-order', 'POST', { bookingId }, userCtx.token);
    if (!orderRes.success) {
        console.log(`[SYSTEM] Razorpay dummy credentials threw an error correctly.`);
        console.log(`[SYSTEM] We will simulate a local Razorpay Order ID for the Webhook to test Crypto math!`);
        
        // Manual override for dev test because Razorpay blocks without real keys
        const mongoose = require('mongoose');
        await mongoose.connect('mongodb+srv://adminUser:oIrm6T6B2Tq0h1lO@cluster0.p0d8u.mongodb.net/guide_go?retryWrites=true&w=majority&appName=Cluster0');
        const Booking = require('./models/Booking');
        await Booking.findByIdAndUpdate(bookingId, { paymentId: 'order_test_12345' });
        console.log('[SYSTEM] DB paymentId Force-injected to "order_test_12345"');
    }

    // 4. Simulate the Webhook!
    const targetOrderId = orderRes?.data?.id || 'order_test_12345';
    const webhookPayload = { payload: { payment: { entity: { order_id: targetOrderId } } } };
    
    // Hash the signature!
    const secret = 'dummy_secret'; // Hardcoded inside paymentController.js fallback
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(webhookPayload));
    const digest = shasum.digest('hex');

    console.log(`[WEBHOOK] Hitting /api/payments/webhook with SHA256 Signature Header: ${digest}`);
    const webhookRes = await jsonReq('/api/payments/webhook', 'POST', webhookPayload, null, {
        'x-razorpay-signature': digest
    });

    console.log(`[WEBHOOK] Response:`, webhookRes);

    // Verify the DB!
    const mongoose = require('mongoose');
    const Booking = require('./models/Booking');
    const finalBooking = await Booking.findById(bookingId);
    
    console.log(`[VALIDATION] Final Booking isPaid -> ${finalBooking.isPaid}`);
    console.log(`[VALIDATION] Final Booking adminCommission (20%) -> ${finalBooking.adminCommission}`);
    console.log(`[VALIDATION] Final Booking guidePayout (80%) -> ${finalBooking.guidePayout}`);

    process.exit(finalBooking.isPaid ? 0 : 1);
}

testPhase6().catch(err => {
    console.error(err);
    process.exit(1);
});
