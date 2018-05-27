import express from 'express'
import http from 'http'
import socketio from 'socket.io'
import * as constants from './constants'
const app = express()
const httpServer = http.Server(app)
const io = socketio(httpServer)
io.set('origins', '*:*')

app.use(express.static('dist'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '../dist/client/index.html')
})
const users = []
io.on(constants.IO_CONNECTION, socket => {
  socket.on(constants.IO_DISCONNECT, function (e) {
    console.log('user disconnected', JSON.stringify(e))
  })
  socket.on(constants.GET_CONNECTED_USERS, socket => {
    console.log('requesting connected users')
  })
  socket.on('chat message', function (data) {
    console.log('message: ' + JSON.stringify(data))
    socket.broadcast.emit('chat message', data)
  })
  socket.on('user connected', function (data) {
    console.log('user connected:', JSON.stringify(data))
    users.push(data)
    socket.broadcast.emit('user connected', {
      newUser: data,
      allUsers: users
    })
  })
})

httpServer.listen(3000, function () {
  console.log('listening on *:3000')
})
