import { io } from 'socket.io-client';

// ws://122.176.139.248:8098/v1/api/ws  ws://localhost/v1/api/ws
const IBBaseUrl = `ws://122.176.139.248:8098/v1/api/ws`; //wss://localhost:5000/v1/api/ws
const IBAccountId = "DU9313757"; // http://localhost:7985

export const socket = io(IBBaseUrl, {
    autoConnect: false,
    rejectUnauthorized: false
    // extraHeaders: {
    //     "Access-Control-Allow-Origin": "*"
    // }
});