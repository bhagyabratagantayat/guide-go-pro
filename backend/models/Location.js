const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a location name'],
        unique: true
    },
    city: {
        type: String,
        required: [true, 'Please add a city']
    },
    coordinates: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    },
    isServiceAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Add Geospatial Index
locationSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Location', locationSchema);
