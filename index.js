require('dotenv').config()

const server = require('http').createServer()
const io = require('socket.io')(server)

const parties = {}

io.on('connection', socket => {
  console.log('New client connected', socket.id)

  socket.on('party/create', (data, ack) => {
    const { party, password } = data
    console.log(
      `Socket "${socket.id}" is creating party (${party}/${password})`
    )

    if (parties[party]) {
      console.log(`  > Could not create party ${party}`)
      // TODO: Return error message
      return ack(null, { err: true })
    }

    socket.__role = 'host'
    socket.__party = party

    parties[party] = {
      name: party,
      password,
      hostId: socket.id,
      guestsIds: []
    }
  })

  socket.on('party/join', (data, ack) => {
    const { party: partyName, password } = data
    console.log(
      `Socket "${socket.id}" is trying to join party (${partyName}/${password})`
    )

    if (!parties[partyName]) {
      console.log('  > Party does not exist')
      // TODO: Return error message
      return ack(null, { err: true })
    }

    const party = parties[partyName]

    if (party.password !== password) {
      console.log('  > Invalid password')
      // TODO: Return error message
      return ack(null, { err: true })
    }

    socket.__role = 'guest'
    socket.__party = partyName
    party.guestsIds.push(socket.id)

    console.log(`---> JOIN / to host (${party.hostId})`)
    io.to(party.hostId).emit('signaling/join', { id: socket.id })
  })

  socket.on('signaling/ice', ({ id, candidate }) => {
    console.log('ice')
    socket.to(id).emit('signaling/ice', { id: socket.id, candidate })
  })

  socket.on('signaling/offer', ({ id, description }) => {
    console.log('signaling/offer')
    socket.to(id).emit('signaling/offer', { id: socket.id, description })
  })

  socket.on('signaling/answer', ({ id, description }) => {
    console.log('signaling/answer')
    socket.to(id).emit('signaling/answer', { id: socket.id, description })
  })

  socket.on('disconnect', () => {
    if (socket.__role === 'host') {
      console.log(
        `Host "${socket.id} has been disconnected (${socket.__party})"`
      )
      const party = parties[socket.__party]

      // Disconnect all clients
      party.guestsIds.forEach(socketId => {
        io.sockets.sockets[socketId].disconnect()
      })

      // Delete the party
      delete parties[socket.__party]
      console.log(parties)
    } else if (socket.__role === 'guest') {
      console.log(
        `Guest "${socket.id} has been disconnected (${socket.__party})"`
      )
      const party = parties[socket.__party]

      party.guestsIds = party.guestsIds.filter(x => x !== socket.id)
    }
  })
})

server.listen(process.env.PORT, () =>
  console.log(`Server running at *:${process.env.PORT}`)
)
