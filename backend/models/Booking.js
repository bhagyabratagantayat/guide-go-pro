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
        enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentType: {
        type: String,
        enum: ['cash', 'upi'],
        default: 'cash'
    },
    duration: {
        type: Number,
        required: [true, 'Please specify tour duration in hours'],
        default: 1
    },
    otp: {
        type: String,
        default: function() {
            return Math.floor(1000 + Math.random() * 9000).toString();
        }
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    pricePerHour: {
        type: Number,
        default: 500 
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paymentId: {
        type: String
    },
    adminCommission: {
        type: Number,
        default: 0
    },
    guidePayout: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
