const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a location name'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    image: {
        type: String,
        default: 'no-image.jpg'
    },
    coordinates: {
        // Center point of the location for search
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    },
    isPopular: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        enum: ['Historical', 'Religious', 'Nature', 'Uncategorized'],
        default: 'Uncategorized'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Location', locationSchema);
