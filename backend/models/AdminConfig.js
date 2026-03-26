const mongoose = require('mongoose');

const adminConfigSchema = new mongoose.Schema({
    pricePerHour: {
        type: Number,
        default: 500,
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AdminConfig', adminConfigSchema);
