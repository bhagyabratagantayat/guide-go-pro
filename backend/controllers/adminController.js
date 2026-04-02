const Guide = require('../models/Guide');
const Booking = require('../models/Booking');
const AdminConfig = require('../models/AdminConfig');
const User = require('../models/User');
const Location = require('../models/Location');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const activeBookings = await Booking.countDocuments({ status: { $in: ['searching', 'accepted', 'ongoing'] } });
        const completedBookings = await Booking.countDocuments({ status: 'completed' });

        const totalGuides = await Guide.countDocuments();
        const activeGuides = await Guide.countDocuments({ isOnline: true });
        const verifiedGuides = await Guide.countDocuments({ isVerified: true });

        const totalUsers = await User.countDocuments({ role: 'user' });

        res.status(200).json({
            success: true,
            data: {
                bookings: {
                    total: totalBookings,
                    active: activeBookings,
                    completed: completedBookings
                },
                guides: {
                    total: totalGuides,
                    active: activeGuides,
                    verified: verifiedGuides
                },
                users: totalUsers
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get admin config
// @route   GET /api/admin/config
// @access  Private/Admin
exports.getConfig = async (req, res, next) => {
    try {
        let config = await AdminConfig.findOne();
        if (!config) {
            config = await AdminConfig.create({ pricePerHour: 500 });
        }
        res.status(200).json({ success: true, data: config });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update admin config
// @route   PUT /api/admin/config
// @access  Private/Admin
exports.updateConfig = async (req, res, next) => {
    try {
        const { pricePerHour } = req.body;
        
        let config = await AdminConfig.findOne();
        if (config) {
            config.pricePerHour = pricePerHour;
            config.updatedBy = req.user.id;
            await config.save();
        } else {
            config = await AdminConfig.create({ pricePerHour, updatedBy: req.user.id });
        }

        res.status(200).json({ success: true, message: 'Config updated successfully', data: config });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ... existing config methods ...

// @desc    Get all users
// @route   GET /api/admin/users
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find({ role: 'user' });
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all guides
// @route   GET /api/admin/guides
exports.getGuides = async (req, res, next) => {
    try {
        const guides = await Guide.find().populate('userId', 'name email');
        res.status(200).json({ success: true, count: guides.length, data: guides });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
exports.getBookings = async (req, res, next) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const bookings = await Booking.find(filter)
            .populate('touristId', 'name email')
            .populate('guideId', 'name email')
            .sort('-createdAt');
        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get reports
// @route   GET /api/admin/reports
exports.getReports = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ status: 'completed' });
        const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
        
        // Simple daily stats
        const dailyStats = await Booking.aggregate([
            { $match: { status: 'completed' } },
            { $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 },
                revenue: { $sum: "$totalPrice" }
            }},
            { $sort: { _id: -1 } },
            { $limit: 7 }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalRevenue,
                dailyStats
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Approve guide
// @route   PUT /api/admin/guides/approve/:id
exports.approveGuide = async (req, res, next) => {
    try {
        const guide = await Guide.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
        if (!guide) {
            return res.status(404).json({ success: false, message: 'Guide not found' });
        }
        res.status(200).json({ success: true, message: 'Guide approved successfully', data: guide });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Reject guide
// @route   DELETE /api/admin/guides/reject/:id
exports.rejectGuide = async (req, res, next) => {
    try {
        const guide = await Guide.findByIdAndDelete(req.params.id);
        if (!guide) {
            return res.status(404).json({ success: false, message: 'Guide not found' });
        }
        res.status(200).json({ success: true, message: 'Guide rejected and deleted' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Add a location
// @route   POST /api/admin/locations
exports.addLocation = async (req, res, next) => {
    try {
        const location = await Location.create(req.body);
        res.status(201).json({ success: true, data: location });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update a location
// @route   PUT /api/admin/locations/:id
exports.updateLocation = async (req, res, next) => {
    try {
        const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!location) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }
        res.status(200).json({ success: true, data: location });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete a location
// @route   DELETE /api/admin/locations/:id
exports.deleteLocation = async (req, res, next) => {
    try {
        const location = await Location.findByIdAndDelete(req.params.id);
        if (!location) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }
        res.status(200).json({ success: true, message: 'Location deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
