const http = require('http');
const { io } = require('socket.io-client');

async function testPhase4() {
    const port = 3000;
    
    // 1. Get Guide Token
    const authOptions = {
        hostname: 'localhost',
        port,
        path: '/api/auth/test-login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };
    
    const guideContext = await new Promise((resolve) => {
        const req = http.request(authOptions, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.write(JSON.stringify({ role: 'guide' }));
        req.end();
    });

    console.log(`Phase 4: Simulated Guide ${guideContext.email} logged in. Connecting WebSocket...`);

    // 2. Connect WebSocket as a "Tourist Client" watching for global emits
    const socket = io(`http://localhost:${port}`);
    let capturedSocketEvent = false;

    socket.on('connect', () => {
        console.log(`Tourist Map Socket Connected! ID: ${socket.id}`);
        socket.emit('join', guideContext._id); // Arbitrary join
    });

    socket.on('guideLocationUpdate', (data) => {
        console.log(`SUCCESS! Socket 'guideLocationUpdate' received ->`, data.location);
        capturedSocketEvent = true;
        socket.disconnect();
    });
    
    socket.on('guideStatusUpdate', (data) => {
        console.log(`SUCCESS! Socket 'guideStatusUpdate' received -> isOnline:`, data.isOnline);
    });

    // Wait 1 second to ensure connection, then trigger REST payload
    setTimeout(async () => {
        console.log(`Triggering REST Guide updateLocation...`);
        const updateLocOptions = {
            hostname: 'localhost',
            port,
            path: '/api/guides/update-location',
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${guideContext.token}`
            }
        };

        const updateBody = JSON.stringify({ lat: 21.123, lng: 86.456 });

        await new Promise((resolve) => {
            const req = http.request(updateLocOptions, res => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(JSON.parse(data)));
            });
            req.write(updateBody);
            req.end();
        });
    }, 1000);

    // Timeout script after 4 seconds
    setTimeout(() => {
        if (!capturedSocketEvent) {
            console.error('FAILED: Did not catch Socket.io global guideLocationUpdate emission!');
        }
        process.exit(capturedSocketEvent ? 0 : 1);
    }, 4000);
}

testPhase4().catch(console.error);
