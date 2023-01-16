//NodeServer which will handle socket io connections

const path = require('path')
const express = require ('express')
const app =express()

const http = require('http')
const server = http.createServer(app)

const socketio = require('socket.io')
const io = socketio( server, {  cors: {origin:'*'}})


//create static folder
app.use(express.static(path.join(__dirname,'public')))


// const io = require('socket.io')(8000)
const users={}

io.on('connection',socket=>{
    socket.on('new-user-joined', name=>{
        console.log('user connected',name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name)
    })

    socket.on('send', message=>{
        socket.broadcast.emit('receive' , {message: message , name: users[socket.id]})
    })

    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id];
    })
})


server.listen(8000, ()=>{
    console.log('server listening to port 8000')
})