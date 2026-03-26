const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const AdminConfig = require('../models/AdminConfig');

dotenv.config();
connectDB();

const seedConfig = async () => {
    try {
        await AdminConfig.deleteMany();
        
        await AdminConfig.create({
            pricePerHour: 500
        });

        console.log('Admin configuration seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding config:', error);
        process.exit(1);
    }
};

seedConfig();
