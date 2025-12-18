const Session = require('../models/Session');

function initializeSocket(io) {
    // This object will keep track of which users are in which rooms
    const userSocketMap = {};

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        // Event: User joins a room
        socket.on('join-room', async ({ roomId, user }) => {
            try {
                socket.join(roomId);
                userSocketMap[socket.id] = { roomId, userId: user._id, username: user.username };

                // Add user to session participants in DB if not already there
                await Session.findOneAndUpdate(
                    { roomId },
                    { $addToSet: { participants: user._id } }
                );

                // Fetch current state of the room
                const session = await Session.findOne({ roomId }).populate('participants', 'username role');
                
                // Send current code and participants to the newly joined user
                socket.emit('initial-state', {
                    code: session.currentCode,
                    participants: session.participants
                });

                // Notify others in the room that a new user has joined
                socket.to(roomId).emit('user-joined', {
                    userId: user._id,
                    username: user.username,
                    socketId: socket.id
                });

                console.log(`User ${user.username} (${socket.id}) joined room ${roomId}`);

            } catch (error) {
                console.error("Error in join-room:", error);
                socket.emit('error', 'Could not join room.');
            }
        });

        // Event: Code is changed by a user
        socket.on('code-change', async ({ roomId, newCode }) => {
            // Broadcast the change to all other clients in the room
            socket.to(roomId).emit('code-update', newCode);
            // Save the latest code to the database
            await Session.updateOne({ roomId }, { currentCode: newCode });
        });
        
        // Event: Student raises hand
        socket.on('raise-hand', async ({ roomId, user }) => {
            try {
                const session = await Session.findOneAndUpdate(
                    { roomId },
                    { 
                        isHandRaised: true, 
                        raisedBy: { user: user._id, username: user.username }
                    },
                    { new: true }
                ).populate('raisedBy.user', 'username');

                // Notify everyone in the room
                io.to(roomId).emit('hand-raised-room', { username: user.username });
                
                // Notify all connected TAs for the dashboard
                io.emit('hand-raised-ta-dashboard', { 
                    roomId: session.roomId,
                    raisedBy: session.raisedBy,
                    updatedAt: session.updatedAt
                });

            } catch(error) {
                console.error("Error in raise-hand:", error);
            }
        });

        socket.on('webrtc-offer', ({ to, offer }) => {
            socket.to(to).emit('webrtc-offer', { from: socket.id, offer });
        });

        socket.on('webrtc-answer', ({ to, answer }) => {
            socket.to(to).emit('webrtc-answer', { from: socket.id, answer });
        });

        socket.on('webrtc-ice-candidate', ({ to, candidate }) => {
            socket.to(to).emit('webrtc-ice-candidate', { from: socket.id, candidate });
        });

        // Event: User disconnects
        socket.on('disconnect', async () => {
            const userInfo = userSocketMap[socket.id];
            if (userInfo) {
                const { roomId, userId, username } = userInfo;
                console.log(`User ${username} (${socket.id}) disconnected from room ${roomId}`);
                
                // Notify others in the room
                socket.to(roomId).emit('user-left', { userId, username, socketId: socket.id });

                delete userSocketMap[socket.id];
            }
        });
    });
}

module.exports = initializeSocket;
