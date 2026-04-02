const fs = require('fs');
const content = `
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
`;
fs.appendFileSync('./controllers/bookingController.js', content);
console.log('Appended successfully');
