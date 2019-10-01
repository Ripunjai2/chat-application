const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words');
const { generateMessage } = require('./utils/messages')
const { generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)


const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log('New WebSocket connection')


    socket.on('join', ({ username, room },callback) => {
        //socket.emit io.emit socket.broadcast.emit
        //io.to.emit socket.broadcast.to.emit
        const { error, user } = addUser({ id: socket.id, username, room });
        if (error) {
            callback(error);
        }

        socket.join(user.room);

        socket.emit('message', generateMessage('Admin','Welcome to room ' + user.room))
        socket.broadcast.to(room).emit('message', generateMessage('Admin',user.username + ' has joined'))
       
        socket.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        callback();
    })



    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();

        const id=socket.id;
        const user=getUser(id);
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed here');
        }
        io.to(user.room).emit('message', generateMessage(user.username,message))
        callback('Delivveeerrrreeeeeddddddddd');
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {

            io.to(user.room).emit('message', generateMessage('Admin',user.username + ' has left!'))
            socket.to(user.room).broadcast.emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }

    })

    socket.on('sendLocation', (coords, callback) => {
       const user= getUser(socket.id)
        io.to(user.room).emit('sendLocation', generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback('Location shared!!!')
    })
})

server.listen(port, () => {
    console.log('running on port ' + port);
})
