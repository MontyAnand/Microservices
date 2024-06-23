const { LoadBalancer } = require('./LoadBalancer');
const { configuration } = require('./config');
const io = require('socket.io-client');
const http = require('node:http');
const { Server } = require('socket.io');
const loadBalancer = new LoadBalancer(configuration);
const dataSourceServerURL = 'http://localhost:54321';
const PORT = 7777;
const socket = io(dataSourceServerURL, {
    transports: ['websocket'] ,
    reconnectionAttempts: 5,
    timeout: 10000
});

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', (reason) => {
    console.log('Disconnected from server:', reason);
});

socket.on('connect_error', (error) => {
    console.error('Connection error:', error.message);
});

socket.on('reconnect_attempt', (attempt) => {
    console.log(`Reconnection attempt #${attempt}`);
});

socket.on('reconnect', (attempt) => {
    console.log(`Successfully reconnected after ${attempt} attempts`);
});

socket.on('reconnect_error', (error) => {
    console.error('Reconnection error:', error.message);
});

socket.on('reconnect_failed', () => {
    console.error('Reconnection failed');
});


const server = http.createServer();
const ioServer = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

ioServer.on('connection', (socket) => {
    console.log(`client connected : ${socket.id}`);
});

socket.on('incomingData', (data) => {
    console.log('Data from data source ',data);
    loadBalancer.handleData(data)
        .then((val) => {
            console.log(data);
            ioServer.emit('dataFromEngine', val);
        })
        .catch((err) => {
            console.log(err);
        });
});

server.listen(PORT, () => {
    console.log(`Load Balancer server running on port ${PORT}`);
})