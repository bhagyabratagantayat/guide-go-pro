const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    guideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guide',
        default: null
    },
    locationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    status: {
        type: String,
        enum: ['searching', 'accepted', 'ongoing', 'completed', 'cancelled'],
        default: 'searching'
    },
    otp: {
        type: String,
        required: true
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    pricePerHour: {
        type: Number,
        default: 500 // Base price per hour
    },
    totalPrice: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
