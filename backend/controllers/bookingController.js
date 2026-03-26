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
        const { locationId, lat, lng } = req.body;

        if (!locationId || !lat || !lng) {
            return res.status(400).json({ success: false, message: 'Please provide locationId, lat, and lng' });
        }

        // Fetch current price per hour from admin config
        const config = await AdminConfig.findOne();
        const pricePerHour = config ? config.pricePerHour : 500;

        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        const booking = await Booking.create({
            userId: req.user.id,
            locationId,
            otp,
            pricePerHour,
            status: 'searching'
        });

        // Broadcast to nearby guides
        const io = getIO();
        const nearbyGuides = await Guide.aggregate([
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
                    distanceField: 'distance',
                    maxDistance: 5000, // 5km
                    spherical: true,
                    query: { isVerified: true, isOnline: true, currentBooking: null }
                }
            }
        ]);

        nearbyGuides.forEach(guide => {
            io.to(guide.userId.toString()).emit('newBooking', {
                bookingId: booking._id,
                locationId,
                distance: guide.distance,
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
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Handle race condition: check if already accepted
        if (booking.status !== 'searching') {
            return res.status(400).json({ success: false, message: 'Booking already accepted' });
        }

        const guide = await Guide.findOne({ userId: req.user.id });
        if (!guide) {
            return res.status(404).json({ success: false, message: 'Guide profile not found' });
        }

        // Update booking
        booking.guideId = guide._id;
        booking.status = 'accepted';
        await booking.save();

        // Update guide
        guide.currentBooking = booking._id;
        await guide.save();

        // Notify user/room
        const io = getIO();
        io.to(booking.userId.toString()).emit('bookingAccepted', {
            bookingId: booking._id,
            guideName: guide.name,
            guidePhone: guide.phone,
            profilePhoto: guide.profilePhoto
        });

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
