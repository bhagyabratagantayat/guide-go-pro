const Guide = require('../models/Guide');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Register guide
// @route   POST /api/guides/register
// @access  Private (Needs User to be logged in first or done during registration)
// Assuming registration creates a User first or links to current User
exports.registerGuide = async (req, res, next) => {
    try {
        const { name, email, phone, location } = req.body;

        // Check if guide already exists
        let guide = await Guide.findOne({ email });
        if (guide) {
            return res.status(400).json({ success: false, message: 'Guide already registered with this email' });
        }

        // Get file URLs from Cloudinary (Multer-Cloudinary)
        const profilePhoto = req.files.profilePhoto ? req.files.profilePhoto[0].path : 'no-photo.jpg';
        const aadhar = req.files.aadhar ? req.files.aadhar[0].path : '';
        const pan = req.files.pan ? req.files.pan[0].path : '';

        // Create guide
        guide = await Guide.create({
            userId: req.user.id,
            name,
            email,
            phone,
            profilePhoto,
            documents: { aadhar, pan },
            location: location ? JSON.parse(location) : { type: 'Point', coordinates: [0, 0] },
            isVerified: false
        });

        // Send email notification
        try {
            await sendEmail({
                email: guide.email,
                subject: 'GuideGo - Application Under Review',
                message: `Hi ${guide.name}, your guide application has been received and is currently under review by our admin team. We will notify you once you are approved.`
            });
        } catch (err) {
            console.error('Email could not be sent', err);
        }

        res.status(201).json({
            success: true,
            message: 'Guide registered, waiting for admin approval',
            data: guide
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
// @desc    Get nearby guides
// @route   GET /api/guides/nearby
// @access  Public
exports.getNearbyGuides = async (req, res, next) => {
    try {
        const { lat, lng } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ success: false, message: 'Please provide latitude and longitude' });
        }

        const guides = await Guide.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    distanceField: 'distance',
                    spherical: true,
                    query: {
                        isVerified: true,
                        isOnline: true,
                        currentBooking: null
                    }
                }
            },
            {
                $sort: {
                    rating: -1,
                    distance: 1
                }
            },
            {
                $limit: 5
            }
        ]);

        res.status(200).json({
            success: true,
            count: guides.length,
            data: guides
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update guide live location
// @route   POST /api/guides/update-location
// @access  Private/Guide
exports.updateLocation = async (req, res, next) => {
    try {
        const { lat, lng } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({ success: false, message: 'Please provide latitude and longitude' });
        }

        const guide = await Guide.findOneAndUpdate(
            { userId: req.user.id },
            {
                location: {
                    type: 'Point',
                    coordinates: [parseFloat(lng), parseFloat(lat)]
                }
            },
            { new: true, runValidators: true }
        );

        if (!guide) {
            return res.status(404).json({ success: false, message: 'Guide profile not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Location updated successfully',
            data: guide
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Toggle online status
// @route   PUT /api/guides/toggle-status
// @access  Private/Guide
exports.toggleStatus = async (req, res, next) => {
    try {
        const guide = await Guide.findOne({ userId: req.user.id });
        if (!guide) {
            return res.status(404).json({ success: false, message: 'Guide profile not found' });
        }

        guide.isOnline = !guide.isOnline;
        await guide.save();

        res.status(200).json({
            success: true,
            message: `Guide is now ${guide.isOnline ? 'online' : 'offline'}`,
            isOnline: guide.isOnline
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
