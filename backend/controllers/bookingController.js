const Booking = require('../models/Booking');
const Guide = require('../models/Guide');
const Location = require('../models/Location');
const AdminConfig = require('../models/AdminConfig');
const { getIO } = require('../utils/socket');

// @desc    Create booking
// @route   POST /api/bookings/create
// @access  Private
exports.createBooking = async (req, res, next) => {
    try {
        const { locationId, duration, paymentType, lat, lng } = req.body;

        if (!locationId || !lat || !lng) {
            return res.status(400).json({ success: false, message: 'Please provide locationId, lat, and lng' });
        }

        const location = await Location.findById(locationId);
        if (!location) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }

        // Fetch current price per hour from admin config or use default
        const config = await AdminConfig.findOne();
        const pricePerHour = config ? config.pricePerHour : 500;

        const booking = await Booking.create({
            userId: req.user.id,
            locationId,
            duration: duration || 1,
            paymentType: paymentType || 'cash',
            pricePerHour,
            totalPrice: (duration || 1) * pricePerHour,
            status: 'pending'
        });

        // Broadcast to nearby guides
        const io = getIO();
        const nearbyGuides = await Guide.aggregate([
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
                    distanceField: 'distance',
                    maxDistance: 10000, // 10km for broader reach
                    spherical: true,
                    query: { isVerified: true, isOnline: true, currentBooking: null }
                }
            }
        ]);

        nearbyGuides.forEach(guide => {
            io.to(guide.userId.toString()).emit('newBookingRequest', {
                bookingId: booking._id,
                locationId,
                locationName: location.name,
                duration: booking.duration,
                totalPrice: booking.totalPrice,
                userName: req.user.name
            });
        });

        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Accept booking
// @route   POST /api/bookings/accept/:id
// @access  Private/Guide
exports.acceptBooking = async (req, res, next) => {
    try {
        const guide = await Guide.findOne({ userId: req.user.id });
        if (!guide) {
            return res.status(404).json({ success: false, message: 'Guide profile not found' });
        }

        // ATOMIC UPDATE to prevent race conditions
        const booking = await Booking.findOneAndUpdate(
            { _id: req.params.id, status: 'pending' },
            { 
                guideId: guide._id, 
                status: 'accepted' 
            },
            { new: true }
        );

        if (!booking) {
            return res.status(400).json({ 
                success: false, 
                message: 'Booking not available or already accepted by another guide' 
            });
        }

        // Update guide
        guide.currentBooking = booking._id;
        await guide.save();

        // Notify user
        const io = getIO();
        io.to(booking.userId.toString()).emit('bookingAccepted', {
            bookingId: booking._id,
            guideName: guide.name,
            guidePhone: guide.phone,
            profilePhoto: guide.profilePhoto,
            otp: booking.otp // Send OTP to user upon acceptance
        });

        // Notify other guides that this booking is taken
        io.emit('bookingTaken', { bookingId: booking._id });

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Start trip (Verify OTP)
// @route   POST /api/bookings/start
// @access  Private/Guide
exports.startTrip = async (req, res, next) => {
    try {
        const { bookingId, otp } = req.body;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        booking.status = 'ongoing';
        booking.startTime = Date.now();
        await booking.save();

        // Notify user
        const io = getIO();
        io.to(booking.userId.toString()).emit('tripStarted', { startTime: booking.startTime });

        res.status(200).json({ success: true, message: 'Trip started', data: booking });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    End trip
// @route   POST /api/bookings/end
// @access  Private/Guide
exports.endTrip = async (req, res, next) => {
    try {
        const { bookingId } = req.body;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking.status = 'completed';
        booking.endTime = Date.now();

        // Calculate total price
        const durationMs = booking.endTime - booking.startTime;
        const durationHours = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60)));
        booking.totalPrice = durationHours * booking.pricePerHour;

        await booking.save();

        // Release guide
        await Guide.findByIdAndUpdate(booking.guideId, { currentBooking: null });

        // Notify user/room
        const io = getIO();
        io.to(bookingId).emit('tripEnded', {
            totalPrice: booking.totalPrice,
            endTime: booking.endTime,
            totalTime: durationHours
        });

        res.status(200).json({ success: true, message: 'Trip completed', data: booking });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user-bookings
// @access  Private
exports.getUserBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id })
            .populate('guideId', 'name profilePhoto rating')
            .populate('locationId', 'name city')
            .sort('-createdAt');
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get guide bookings
// @route   GET /api/bookings/guide-bookings
// @access  Private/Guide
exports.getGuideBookings = async (req, res, next) => {
    try {
        const guide = await Guide.findOne({ userId: req.user.id });
        if (!guide) {
            return res.status(404).json({ success: false, message: 'Guide not found' });
        }
        const bookings = await Booking.find({ guideId: guide._id })
            .populate('userId', 'name')
            .populate('locationId', 'name city')
            .sort('-createdAt');
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Cancel booking
// @route   POST /api/bookings/cancel/:id
// @access  Private/User
exports.cancelBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Only allow user who created it to cancel
        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'User not authorized to cancel this booking' });
        }

        if (booking.status !== 'pending' && booking.status !== 'accepted') {
            return res.status(400).json({ success: false, message: 'Only pending or accepted bookings can be cancelled' });
        }

        booking.status = 'cancelled';
        await booking.save();

        if (booking.guideId) {
            // Free the guide
            await Guide.findByIdAndUpdate(booking.guideId, { currentBooking: null });
            
            // Notify the specific guide over socket
            const io = getIO();
            const guide = await Guide.findById(booking.guideId);
            if (guide) {
                io.to(guide.userId.toString()).emit('bookingCancelled', { bookingId: booking._id });
            }
        }

        res.status(200).json({ success: true, message: 'Booking cancelled successfully', data: booking });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
