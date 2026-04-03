const http = require('http');

const data = JSON.stringify({ role: 'admin' });

const options = {
  hostname: 'localhost',
  port: 5000, // Try 5000 since PRD says 5000, or 3000
  path: '/api/auth/test-login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let chunks = [];
  res.on('data', d => chunks.push(d));
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', Buffer.concat(chunks).toString()));
});

req.on('error', (e) => {
  // If 5000 fails, try 3000
  if (e.code === 'ECONNREFUSED') {
    options.port = 3000;
    const req2 = http.request(options, (res) => {
      let chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => console.log('Status:', res.statusCode, 'Body:', Buffer.concat(chunks).toString()));
    });
    req2.on('error', e2 => console.error('Both 5000 and 3000 failed.'));
    req2.write(data);
    req2.end();
  } else {
    console.error(e);
  }
});

req.write(data);
req.end();
