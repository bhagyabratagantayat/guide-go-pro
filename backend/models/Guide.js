const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    profilePhoto: {
        type: String,
        default: 'no-photo.jpg'
    },
    documents: {
        aadhar: String,
        pan: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    location: {
        // GeoJSON Point
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
    isOnline: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0
    },
    currentBooking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        default: null
    }
}, {
    timestamps: true
});

// Add Geospatial Index
guideSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Guide', guideSchema);
