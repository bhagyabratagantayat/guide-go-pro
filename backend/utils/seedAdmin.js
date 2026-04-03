const User = require('../models/User');
const Guide = require('../models/Guide');
const Booking = require('../models/Booking');
const Location = require('../models/Location');

const seedAdmin = async () => {
    try {
        // 0. Seed Locations
        const locations = [
            {
                name: 'Khandagiri Hills',
                description: 'Ancient rock-cut caves and Jain temples dating back to the 2nd century BCE.',
                image: 'https://images.unsplash.com/photo-1626261543787-8e6d2b6b0b5e?auto=format&fit=crop&q=80',
                coordinates: { type: 'Point', coordinates: [85.7865, 20.2619] },
                category: 'Historical',
                isPopular: true
            },
            {
                name: 'Konark Sun Temple',
                description: 'A 13th-century Sun Temple and a UNESCO World Heritage Site.',
                image: 'https://images.unsplash.com/photo-1590050752117-23a9d7f2bb24?auto=format&fit=crop&q=80',
                coordinates: { type: 'Point', coordinates: [86.0945, 19.8876] },
                category: 'Historical',
                isPopular: true
            },
            {
                name: 'Jagannath Temple',
                description: 'One of the Char Dham pilgrimage sites and a key religious center.',
                image: 'https://images.unsplash.com/photo-1621360841013-e76d5483f982?auto=format&fit=crop&q=80',
                coordinates: { type: 'Point', coordinates: [85.8179, 19.8049] },
                category: 'Religious',
                isPopular: true
            }
        ];

        for (const loc of locations) {
            if (!await Location.findOne({ name: loc.name })) {
                await Location.create(loc);
                console.log(`📍 Seeded location: ${loc.name}`);
            }
        }

        // 1. CLEAR EXISTING DATA FOR CLEAN SLATE (Optional)
        // await User.deleteMany({ email: { $regex: /@example.com|admin@guidego.com/ } });
        // await Guide.deleteMany({});
        // await Booking.deleteMany({});

        // 2. Create Test Guide
        const guideEmail = 'odisha@example.com';
        if (!await User.findOne({ email: guideEmail })) {
            const user = await User.create({ name: 'Odisha Guide', email: guideEmail, password: 'password123', role: 'guide' });
            await Guide.create({
                userId: user._id, name: user.name, email: user.email, isVerified: true, isOnline: true,
                pricePerHour: 500, rating: 4.8, tripsCompleted: 15,
                location: { type: 'Point', coordinates: [85.8245, 20.2961] }
            });
        }

        // 3. Create Test User
        const userEmail = 'test-user@example.com';
        if (!await User.findOne({ email: userEmail })) {
            await User.create({ name: 'Test User', email: userEmail, password: 'password123', role: 'user' });
        }

        // 4. Seed MORE guides and mark them ONLINE
        const userCount = await User.countDocuments();
        if (userCount < 10) {
            console.log('🌱 Adding more online guides for map testing...');
            const names = ['Amit Kumar', 'Priya Singh', 'Rajesh Mohanty', 'Sita Devi'];
            for (let i = 0; i < names.length; i++) {
                const email = `guide${i}@example.com`;
                const user = await User.create({ name: names[i], email, password: 'password123', role: 'guide' });
                await Guide.create({
                    userId: user._id, name: user.name, email: user.email, isVerified: true, isOnline: true,
                    pricePerHour: 400 + (i * 100), rating: 4.5 + (i * 0.1), tripsCompleted: 5 + (i * 5),
                    location: { type: 'Point', coordinates: [85.8245 + (i * 0.01), 20.2961 + (i * 0.01)] }
                });
            }
            console.log('✅ Maps are now populated with online guides');
        }

    } catch (error) {
        console.error('❌ Failed to seed accounts:', error.message);
    }
};

module.exports = seedAdmin;
