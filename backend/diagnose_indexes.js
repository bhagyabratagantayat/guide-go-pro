const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const diagnoseIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('guides');

        const indexes = await collection.listIndexes().toArray();
        console.log('CURRENT INDEXES:', JSON.stringify(indexes, null, 2));

        // Let's drop ALL indexes except _id to be absolutely sure
        for (const index of indexes) {
            if (index.name !== '_id_') {
                console.log(`Dropping index: ${index.name}`);
                await collection.dropIndex(index.name);
            }
        }

        console.log('Re-creating clean 2dsphere index...');
        await collection.createIndex({ location: '2dsphere' }, { name: 'location_2dsphere' });

        const finalIndexes = await collection.listIndexes().toArray();
        console.log('FINAL INDEXES:', JSON.stringify(finalIndexes, null, 2));

        process.exit(0);
    } catch (err) {
        console.error('Diagnosis failed:', err);
        process.exit(1);
    }
};

diagnoseIndexes();
