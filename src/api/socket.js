import { io } from 'socket.io-client';

const IBBaseUrl = `wss://localhost:5000/v1/api/ws`;
const IBAccountId = "DU9313757";

export const socket = io(IBBaseUrl, {
    autoConnect: false
});
