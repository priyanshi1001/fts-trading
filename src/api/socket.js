import { io } from 'socket.io-client';

const nodeSocketUrl = `http://43.230.64.35:9012`; // http://43.230.64.35:9012
const IBAccountId = "DU9313757"; // http://localhost:5050 

export const socket = io(nodeSocketUrl, {
    autoConnect: false
});