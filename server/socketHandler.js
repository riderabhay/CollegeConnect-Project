// server/socketHandler.js

const rooms = {}; 

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`[SOCKET] Connected: ${socket.id}`);

        socket.on('join_room', (roomId, peerId) => {
            console.log(`[ROOM] User ${peerId} joining room: ${roomId}`);
            
            socket.join(roomId);
            
            // 🌟 FIX: Broadcast the new peer ID to everyone else in the room
            socket.broadcast.to(roomId).emit('user_joined', peerId);

            // Optional: Room management (for cleanup)
            if (!rooms[roomId]) { rooms[roomId] = []; }
            if (!rooms[roomId].includes(peerId)) { rooms[roomId].push(peerId); }
        });
        
        // ... (send_message event as previously provided) ...

        socket.on('disconnect', () => {
            console.log(`[SOCKET] Disconnected: ${socket.id}`);
        });
    });
};