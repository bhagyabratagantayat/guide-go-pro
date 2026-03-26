const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Location = require('../models/Location');

dotenv.config({ path: './.env' });

const locations = [
    { name: 'Khandagiri Hill', city: 'Bhubaneswar', coordinates: { type: 'Point', coordinates: [85.7865, 20.2619] } },
    { name: 'Udayagiri Caves', city: 'Bhubaneswar', coordinates: { type: 'Point', coordinates: [85.7875, 20.2625] } },
    { name: 'Lingaraj Temple', city: 'Bhubaneswar', coordinates: { type: 'Point', coordinates: [85.8395, 20.2382] } },
    { name: 'Dhauli Shanti Stupa', city: 'Bhubaneswar', coordinates: { type: 'Point', coordinates: [85.8451, 20.1917] } },
    { name: 'Jaydev Vatika', city: 'Bhubaneswar', coordinates: { type: 'Point', coordinates: [85.7950, 20.2650] } },
    { name: 'Nandankanan Zoo', city: 'Bhubaneswar', coordinates: { type: 'Point', coordinates: [85.8315, 20.3957] } },
    { name: 'Konark Sun Temple', city: 'Konark', coordinates: { type: 'Point', coordinates: [86.0945, 19.8876] } },
    { name: 'Jagannath Temple', city: 'Puri', coordinates: { type: 'Point', coordinates: [85.8179, 19.8135] } },
    { name: 'Chilika Lake', city: 'Satapada', coordinates: { type: 'Point', coordinates: [85.4500, 19.6667] } },
    { name: 'Puri Beach', city: 'Puri', coordinates: { type: 'Point', coordinates: [85.8200, 19.8000] } },
    { name: 'Barabati Fort', city: 'Cuttack', coordinates: { type: 'Point', coordinates: [85.8672, 20.4820] } },
    { name: 'Cuttack Chandi Temple', city: 'Cuttack', coordinates: { type: 'Point', coordinates: [85.8600, 20.4700] } },
    { name: 'Hirakud Dam', city: 'Sambalpur', coordinates: { type: 'Point', coordinates: [83.8700, 21.5300] } },
    { name: 'Samaleswari Temple', city: 'Sambalpur', coordinates: { type: 'Point', coordinates: [83.9700, 21.4700] } },
    { name: 'Simlipal National Park', city: 'Mayurbhanj', coordinates: { type: 'Point', coordinates: [86.4100, 21.9300] } },
    { name: 'Bhitar Kanika Park', city: 'Kendrapara', coordinates: { type: 'Point', coordinates: [86.7000, 20.7300] } },
    { name: 'Daringbadi', city: 'Kandhamal', coordinates: { type: 'Point', coordinates: [84.1300, 19.9100] } },
    { name: 'Gopalpur Beach', city: 'Ganjam', coordinates: { type: 'Point', coordinates: [84.9000, 19.2600] } },
    { name: 'Taratarini Temple', city: 'Ganjam', coordinates: { type: 'Point', coordinates: [84.7900, 19.4900] } },
    { name: 'Chandipur Beach', city: 'Balasore', coordinates: { type: 'Point', coordinates: [87.0200, 21.4400] } },
    { name: 'Talsari Beach', city: 'Balasore', coordinates: { type: 'Point', coordinates: [87.4500, 21.6100] } },
    { name: 'Kapilash Temple', city: 'Dhenkanal', coordinates: { type: 'Point', coordinates: [85.9000, 20.6800] } },
    { name: 'Saptasajya', city: 'Dhenkanal', coordinates: { type: 'Point', coordinates: [85.9500, 20.6000] } },
    { name: 'Ranipur Jharial', city: 'Bolangir', coordinates: { type: 'Point', coordinates: [82.9600, 20.2900] } },
    { name: 'Harishankar Temple', city: 'Bolangir', coordinates: { type: 'Point', coordinates: [82.8500, 20.8500] } },
    { name: 'Nrusinghanath', city: 'Bargarh', coordinates: { type: 'Point', coordinates: [82.8300, 20.9100] } },
    { name: 'Vedvyas', city: 'Rourkela', coordinates: { type: 'Point', coordinates: [84.8100, 22.2200] } },
    { name: 'Gudguda Waterfall', city: 'Sambalpur', coordinates: { type: 'Point', coordinates: [84.2500, 21.7500] } },
    { name: 'Khandadhar Fall', city: 'Sundargarh', coordinates: { type: 'Point', coordinates: [85.1000, 21.7600] } },
    { name: 'Barehipani Falls', city: 'Mayurbhanj', coordinates: { type: 'Point', coordinates: [86.3800, 21.9300] } },
    { name: 'Mukteshwar Temple', city: 'Bhubaneswar', coordinates: { type: 'Point', coordinates: [85.8400, 20.2400] } },
    { name: 'Rajarani Temple', city: 'Bhubaneswar', coordinates: { type: 'Point', coordinates: [85.8450, 20.2500] } }
];

const seedLocations = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        await Location.deleteMany();
        console.log('Old locations removed.');

        await Location.insertMany(locations);
        console.log(`${locations.length} Odisha tourist locations seeded successfully!`);

        process.exit();
    } catch (error) {
        console.error('Error seeding locations:', error.message);
        process.exit(1);
    }
};

seedLocations();
