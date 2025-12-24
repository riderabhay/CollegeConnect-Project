// client/src/socket.js

import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000';

// 🌟 FIX: Global scope mein ek variable declare karein
// taki connection sirf ek baar initialize ho, chahe file kitni baar bhi re-run ho.
let socketInstance = null;

if (!socketInstance) {
    socketInstance = io(SOCKET_SERVER_URL, {
        autoConnect: true,
        reconnection: true, 
        // Force Vite/HMR to ignore this module's hot updates
        // Note: Production build mein yeh if condition hat jaegi.
    });

    socketInstance.on('connect', () => {
        console.log('--- GLOBAL SOCKET CONNECTED SUCCESSFULLY (HMR Guard) ---');
    });

    socketInstance.on('disconnect', () => {
        console.log('--- GLOBAL SOCKET DISCONNECTED (HMR Guard) ---');
    });
}

// 🌟 FIX: Global instance ko export karein
export const socket = socketInstance;