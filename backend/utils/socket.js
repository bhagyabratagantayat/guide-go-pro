let io;

module.exports = {
    init: (server) => {
        io = require('socket.io')(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });

        io.on('connection', (socket) => {
            console.log('User connected:', socket.id);

            socket.on('join', (userId) => {
                socket.join(userId);
                socket.userId = userId;
                console.log(`User ${userId} joined their personal room`);
            });

            socket.on('joinBooking', (bookingId) => {
                socket.join(bookingId);
                console.log(`User joined booking room: ${bookingId}`);
            });

            socket.on('guideLocationUpdate', (data) => {
                // Broadcast to the booking room
                io.to(data.bookingId).emit('updateGuideLocation', {
                    lat: data.lat,
                    lng: data.lng
                });
            });

            socket.on('disconnect', async () => {
                console.log('User disconnected');
                // Optional: Update isOnline: false in DB if user is a guide
                if (socket.userId) {
                    try {
                        const Guide = require('../models/Guide');
                        await Guide.findOneAndUpdate({ userId: socket.userId }, { isOnline: false });
                    } catch (err) {
                        console.error('Error updating guide status on disconnect:', err);
                    }
                }
            });
        });

        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized');
        }
        return io;
    }
};
