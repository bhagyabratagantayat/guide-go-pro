const http = require('http');

async function testPhase3() {
    const port = 3000;
    
    // 1. Register a Guide
    const regOptions = {
        hostname: 'localhost',
        port,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };
    
    const guideEmail = `test-guide-${Date.now()}@example.com`;
    const regBody = JSON.stringify({
        name: 'Test Guide Onboarding',
        email: guideEmail,
        password: 'password123',
        role: 'guide',
        profilePhoto: 'https://cloudinary.com/test-photo.jpg',
        aadhar: '1234-5678-9012',
        pan: 'ABCDE1234F'
    });

    const regResponse = await new Promise((resolve) => {
        const req = http.request(regOptions, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.write(regBody);
        req.end();
    });

    console.log('Register Guide Response:', regResponse);

    // 2. Fetch the created Guide via Admin
    const authOptions = {
        hostname: 'localhost',
        port,
        path: '/api/auth/test-login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };
    const adminToken = await new Promise((resolve) => {
        const req = http.request(authOptions, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data).token));
        });
        req.write(JSON.stringify({ role: 'admin' }));
        req.end();
    });

    const fetchGuideOptions = {
        hostname: 'localhost',
        port,
        path: '/api/admin/guides',
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
    };
    const guidesList = await new Promise((resolve) => {
        const req = http.request(fetchGuideOptions, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.end();
    });

    const createdGuide = guidesList.data.find(g => g.email === guideEmail);
    console.log('Created Guide Document fields -> Photo:', createdGuide.profilePhoto, 'Aadhar:', createdGuide.documents.aadhar, 'isVerified:', createdGuide.isVerified);

    // 3. Admin Approves the Guide
    const approveOptions = {
        hostname: 'localhost',
        port,
        path: `/api/admin/guides/approve/${createdGuide._id}`,
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${adminToken}` }
    };
    
    const approveResponse = await new Promise((resolve) => {
        const req = http.request(approveOptions, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.end();
    });

    console.log(`Guide isVerified status after Admin approval ->`, approveResponse.data.isVerified);
}

testPhase3().catch(console.error);
