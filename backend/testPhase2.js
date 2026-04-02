const http = require('http');

async function testPhase2() {
    const port = 3000;
    
    // 1. Get Admin Token
    const getTokenOptions = {
        hostname: 'localhost',
        port,
        path: '/api/auth/test-login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };
    
    const tokenStr = await new Promise((resolve, reject) => {
        const req = http.request(getTokenOptions, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data).token));
        });
        req.write(JSON.stringify({ role: 'admin' }));
        req.end();
    });

    console.log('Admin Token Received!');

    // 2. Add a Location
    const addLocOptions = {
        hostname: 'localhost',
        port,
        path: '/api/admin/locations',
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenStr}`
        }
    };
    
    const locBody = JSON.stringify({
        name: `Test Location ${Date.now()}`,
        description: 'A beautiful test location for Phase 2 validation',
        isPopular: true,
        category: 'Nature',
        coordinates: {
            type: 'Point',
            coordinates: [85.8, 20.3]
        }
    });

    const addResponse = await new Promise((resolve) => {
        const req = http.request(addLocOptions, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.write(locBody);
        req.end();
    });
    
    console.log('Add Location Response:', addResponse);

    // 3. Search for the Location
    const searchOptions = {
        hostname: 'localhost',
        port,
        path: '/api/locations?search=Test%20Location',
        method: 'GET'
    };
    
    const searchResponse = await new Promise((resolve) => {
        const req = http.request(searchOptions, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.end();
    });

    console.log(`Search Found ${searchResponse.count} locations!`);
    console.log('Search success:', searchResponse.success);
}

testPhase2().catch(console.error);
