const http = require('http');
const { io } = require('socket.io-client');

async function testPhase5() {
    const port = 3000;
    
    // 1. Get Tokens
    const getAuth = (role) => new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost', port, path: '/api/auth/test-login', method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, res => {
            let data = ''; res.on('data', d => data += d);
            res.on('end', () => resolve(JSON.parse(data)));
        }); req.write(JSON.stringify({ role })); req.end();
    });

    const userCtx = await getAuth('user');
    const guideCtx = await getAuth('guide');

    // 2. Guide connect socket
    const guideSocket = io(`http://localhost:${port}`);
    guideSocket.on('connect', () => {
        guideSocket.emit('join', guideCtx._id);
    });

    // We expect to catch a booking, accept it, then user cancels it
    let bookingIdToCancel = null;

    guideSocket.on('newBookingRequest', async (data) => {
        console.log(`[GUIDE] Received Booking Request! Location: ${data.locationName}`);
        bookingIdToCancel = data.bookingId;

        // Accept it!
        const acceptReq = http.request({
            hostname: 'localhost', port, path: `/api/bookings/accept/${bookingIdToCancel}`, method: 'POST',
            headers: { 'Authorization': `Bearer ${guideCtx.token}` }
        }, res => { let d = ''; res.on('data', chunk => d += chunk); res.on('end', () => console.log('[GUIDE] Accepted Booking!', JSON.parse(d).success)); });
        acceptReq.end();
    });

    guideSocket.on('bookingCancelled', (data) => {
        console.log(`[GUIDE] Booking Cancelled properly by user via Socket! Booking: ${data.bookingId}`);
        guideSocket.disconnect();
        userSocket.disconnect();
        process.exit(0);
    });

    // 3. User connect socket
    const userSocket = io(`http://localhost:${port}`);
    userSocket.on('connect', () => {
        userSocket.emit('join', userCtx._id);
    });

    userSocket.on('bookingAccepted', async (data) => {
        console.log(`[USER] Booking Accepted by ${data.guideName}. Sending Cancel Protocol...`);
        // We received acceptance, now cancel it
        const cancelReq = http.request({
            hostname: 'localhost', port, path: `/api/bookings/cancel/${data.bookingId}`, method: 'POST',
            headers: { 'Authorization': `Bearer ${userCtx.token}` }
        }, res => { let d = ''; res.on('data', chunk => d += chunk); res.on('end', () => console.log('[USER] Cancel Fired!', JSON.parse(d).success)); });
        cancelReq.end();
    });

    // WAIT FOR SOCKETS... then Trigger User Create Booking
    setTimeout(async () => {
        // Find arbitrary location to book
        const locReq = http.request({ hostname: 'localhost', port, path: `/api/locations`, method: 'GET' }, res => {
            let data = ''; res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const locId = JSON.parse(data).data[0]?._id;

                console.log(`[USER] Firing Booking POST for Location ${locId}...`);
                const req = http.request({
                    hostname: 'localhost', port, path: '/api/bookings/create', method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userCtx.token}` }
                }, () => {});
                req.write(JSON.stringify({ locationId: locId, lat: 20.2961, lng: 85.8245 }));
                req.end();
            });
        }); locReq.end();
    }, 1500);

    // Timeout
    setTimeout(() => { console.error('FAILED TIMEOUT'); process.exit(1); }, 6000);
}

testPhase5().catch(console.error);
