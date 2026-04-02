const Location = require('../models/Location');
const Guide = require('../models/Guide');

// @desc    Get all locations
// @route   GET /api/locations
// @access  Public
exports.getLocations = async (req, res, next) => {
    try {
        const { search } = req.query;
        let query = {};
        
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const locations = await Location.find(query);
        res.status(200).json({ success: true, count: locations.length, data: locations });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get relative guides count for a location
// @route   GET /api/locations/:id/guides-count
// @access  Public
exports.getGuidesCountAtLocation = async (req, res, next) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }

        const [lng, lat] = location.coordinates.coordinates;

        // Count guides within 10km of this location
        const count = await Guide.countDocuments({
            location: {
                $geoWithin: {
                    $centerSphere: [[lng, lat], 10 / 6378.1] // 10km converted to radians
                }
            },
            isVerified: true,
            isOnline: true,
            currentBooking: null
        });

        res.status(200).json({ success: true, count });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
