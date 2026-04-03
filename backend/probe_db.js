const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const probe = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Guide = require('./models/Guide');
        
        const total = await Guide.countDocuments();
        const online = await Guide.countDocuments({ isOnline: true });
        const verified = await Guide.countDocuments({ isVerified: true });
        const valid = await Guide.countDocuments({ isVerified: true, isOnline: true });
        
        console.log(`TOTAL GUIDES: ${total}`);
        console.log(`ONLINE: ${online}`);
        console.log(`VERIFIED: ${verified}`);
        console.log(`VALID FOR MAP: ${valid}`);
        
        if (valid > 0) {
            const first = await Guide.findOne({ isVerified: true, isOnline: true });
            console.log('Sample Valid Guide:', JSON.stringify(first, null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

probe();
