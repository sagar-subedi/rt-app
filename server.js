const express = require('express');
const http   = require('http')
const socketio = require('socket.io')
const path = require('path');
const formatMessage = require('./utils/message.js')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users.js')

const chatBot = 'Chat Bot'

const app = express();


const server = http.createServer(app)
const ios = socketio(server);

//specify location for static files as the public folder in current directory
app.use(express.static(path.join(__dirname, "public"))) 


//Run when client connects
ios.on('connection', (socket) => {

    socket.on('joinRoom', ({username, room})=>{
        const user = userJoin(socket.id, username, room);
        
        socket.join(user.room);

        socket.emit('message', formatMessage(chatBot,'Welcome to the chatcord'));

        socket.broadcast.to(user.room).emit('message', formatMessage(chatBot,  `${user.username} has joined the chat`));

        ios.to(user.room).emit('roomUsers', {room: user.room, users: getRoomUsers(user.room)})
    
    })

    socket.on("chat-message", message =>{
        const user = getCurrentUser(socket.id);
        ios.to(user.room).emit("message", formatMessage(user.username, message));
    })

    socket.on('disconnect', ()=> {
        //user[] bata tyo user lai khojera hatauna paryo solti
        const user = userLeave(socket.id);
        
        if(user){
            ios.emit('message', formatMessage(chatBot, `${user.username} has left the chat`))
            ios.to(user.room).emit('roomUsers', {room: user.room, users: getRoomUsers(user.room)})
        }
       

    })



})

PORT = 3000 || process.env.PORT;

app.get('/ram', (req,res)=>{
    res.send("Hello")
})

server.listen(PORT, ()=>{
    console.log(`Hello, the server is currently listening on port: ${PORT}`)
})