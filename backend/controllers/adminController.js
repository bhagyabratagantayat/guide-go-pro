const Guide = require('../models/Guide');
const Booking = require('../models/Booking');
const AdminConfig = require('../models/AdminConfig');
const User = require('../models/User');

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

        const totalUsers = await User.countDocuments({ role: 'tourist' });

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

// @desc    Get pending guides
// @route   GET /api/admin/pending-guides
exports.getPendingGuides = async (req, res, next) => {
    try {
        const guides = await Guide.find({ isVerified: false });
        res.status(200).json({ success: true, count: guides.length, data: guides });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Approve guide
// @route   PUT /api/admin/approve/:id
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
// @route   DELETE /api/admin/reject/:id
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
