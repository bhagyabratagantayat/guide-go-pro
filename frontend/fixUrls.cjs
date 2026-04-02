const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) walk(dirPath, callback);
        else callback(path.join(dir, f));
    });
}

walk('./src', function(filePath) {
    if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        if (filePath.replace(/\\/g, '/').endsWith('src/config.js')) return;

        // Ensure CONFIG is imported if we are about to use it
        if ((content.includes('http://localhost:3000') || content.includes("'http://localhost:3000'")) && !content.includes('CONFIG')) {
            // Figure out import path depth
            let depth = filePath.split(path.sep).length - 2; // src/ is depth 0
            let prefix = depth === 0 ? './' : '../'.repeat(depth);
            content = `import { CONFIG } from '${prefix}config';\n` + content;
            modified = true;
        }

        // Replace Backticks
        if (content.includes('`http://localhost:3000/api')) {
             content = content.replace(/`http:\/\/localhost:3000\/api/g, '`${CONFIG.BACKEND_URL}');
             modified = true;
        }
        // Replace Singles
        if (content.includes("'http://localhost:3000/api")) {
             content = content.replace(/'http:\/\/localhost:3000\/api([^']*)'/g, '`${CONFIG.BACKEND_URL}$1`');
             modified = true;
        }
        // Replace Doubles
        if (content.includes('"http://localhost:3000/api')) {
             content = content.replace(/"http:\/\/localhost:3000\/api([^"]*)"/g, '`${CONFIG.BACKEND_URL}$1`');
             modified = true;
        }

        // Replace Socket URLs
        if (content.includes("'http://localhost:3000'")) {
             content = content.replace(/'http:\/\/localhost:3000'/g, 'CONFIG.BASE_URL');
             modified = true;
        }
        if (content.includes('"http://localhost:3000"')) {
             content = content.replace(/"http:\/\/localhost:3000"/g, 'CONFIG.BASE_URL');
             modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Fixed:', filePath);
        }
    }
});
