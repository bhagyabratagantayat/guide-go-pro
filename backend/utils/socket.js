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

            socket.on('disconnect', () => {
                console.log('User disconnected');
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
