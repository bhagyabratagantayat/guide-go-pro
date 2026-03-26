const Location = require('../models/Location');

// @desc    Search locations
// @route   GET /api/locations
// @access  Public
exports.getLocations = async (req, res, next) => {
    try {
        let query;

        if (req.query.search) {
            query = {
                name: { $regex: req.query.search, $options: 'i' },
                isServiceAvailable: true
            };
        } else {
            query = { isServiceAvailable: true };
        }

        const locations = await Location.find(query).limit(10);

        res.status(200).json({
            success: true,
            count: locations.length,
            data: locations
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
