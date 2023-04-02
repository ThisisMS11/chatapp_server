const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const PORT = 3001;
const { Server } = require('socket.io');

app.use(cors());

const END_POINT = 'https://mschat11.netlify.app/'
const END_POINT_LOCAL = 'http://127.0.0.1:5173'

const server = http.createServer(app);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", END_POINT);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const io = new Server(server, {
    cors: {
        // ! this is the origin from where requests will be made to our socket io server from client.
        origin: "*",
        methods: ["GET", "POST"]
    }
});

//Socket io is based on events whenever any event happens we perform some  task
io.on('connection', (socket) => {
    // console.log(socket.id);  
    // this id will be unique every time the client tries to connect with our socket io server.

    console.log("User connected ", socket.id);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {

        // ! we have received some data from client A and we want to share it with the client available at the same room so here is the way to do it. so we are triggering the receive message event at the client side and sending back the info like this.

        socket.to(data.room).emit("receive_message", data);
    })


    // on disconnect event we want some other things
    socket.on('disconnect', () => {
        console.log("User Disconnected . ", socket.id)
    });
});

app.get("/", (req, res) => {
    res.send('we are connected at least ');
})

server.listen(PORT, () => {
    console.log("SERVER RUNNING");
});

// ! why do we need socket.io?
/* If you would open the network tab then you find that there is not http request made but still we are able to send data from our client to the backend that's beauty. */