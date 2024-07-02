import { io } from 'socket.io-client';

const IBBaseUrl = `wss://localhost:5000/v1/api/ws`; //wss://localhost:5000/v1/api/ws
const IBAccountId = "DU9313757"; // http://localhost:7985  ws://localhost/v1/api/ws

export const socket = io(IBBaseUrl, {
    autoConnect: false,
    rejectUnauthorized: false
    // extraHeaders: {
    //     "Access-Control-Allow-Origin": "*"
    // }
});