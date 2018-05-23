require('dotenv').config()

const server = require('http').createServer()
const io = require('socket.io')(server)
const partyRepository = require('./src/repositories/Party')()
const partyService = require('./src/services/Party')({ partyRepository })

io.on('connection', socket => {
  console.log('New client connected', socket.id)

  socket.on('party/create', (data, ack) => {
    const { party, password } = data
    console.log(
      `Socket "${socket.id}" is creating party (${party}/${password})`
    )

    try {
      partyService.createParty(party, password, socket.id)

      socket.__role = 'host'
      socket.__party = party
    } catch (err) {
      // TODO: Handle this properly
    }
  })

  socket.on('party/join', (data, ack) => {
    const { party, password } = data
    console.log(
      `Socket "${socket.id}" is trying to join party (${party}/${password})`
    )

    try {
      partyService.joinParty(party, password, socket.id)

      socket.__role = 'guest'
      socket.__party = party
      ack()

      // TODO: Move this to a signaling service
      console.log(`---> JOIN / to host (${party.hostId})`)
      io.to(party.hostId).emit('signaling/join', { id: socket.id })
    } catch (e) {
      // TODO: Handle this properly
      ack(e)
    }
  })

  socket.on('signaling/ice', ({ id, candidate }) => {
    // TODO: Move this to a signaling service
    console.log('ice')
    socket.to(id).emit('signaling/ice', { id: socket.id, candidate })
  })

  socket.on('signaling/offer', ({ id, description }) => {
    // TODO: Move this to a signaling service
    console.log('signaling/offer')
    socket.to(id).emit('signaling/offer', { id: socket.id, description })
  })

  socket.on('signaling/answer', ({ id, description }) => {
    // TODO: Move this to a signaling service
    console.log('signaling/answer')
    socket.to(id).emit('signaling/answer', { id: socket.id, description })
  })

  socket.on('disconnect', () => {
    if (socket.__role === 'host') {
      console.log(
        `Host "${socket.id} has been disconnected (${socket.__party})"`
      )
      partyService.deleteParty(socket.__party)

      // Disconnect all clients
      // TODO: How to do this properly ?
      // party.guestsIds.forEach(socketId => {
      //   io.sockets.sockets[socketId].disconnect()
      // })
    } else if (socket.__role === 'guest') {
      console.log(
        `Guest "${socket.id} has been disconnected (${socket.__party})"`
      )
      partyService.leaveParty(socket.__party, socket.id)
    }
  })
})

server.listen(process.env.PORT, () =>
  console.log(`Server running at *:${process.env.PORT}`)
)
