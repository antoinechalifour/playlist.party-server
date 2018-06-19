require('dotenv').config()

const server = require('http').createServer()
const io = require('socket.io')(server)
const partyRepository = require('./src/repositories/Party')()
const partyService = require('./src/services/IoPartyDecorator')({
  partyService: require('./src/services/Party')({ partyRepository }),
  io
})

const debugSignaling = (from, to, type, payload = {}) =>
  console.log(`[${type}] ${from} --> ${to} Payload:`, payload)

io.on('connection', socket => {
  console.log('New client connected', socket.id)

  socket.on('party/create', ({ party, code }, ack) => {
    console.log(`Socket "${socket.id}" is creating party (${party}/${code})`)

    try {
      partyService.createParty(party, code, socket.id)

      socket.__role = 'host'
      socket.__party = party

      ack()
    } catch (err) {
      ack(err)
    }
  })

  socket.on('party/join', ({ party, code }, ack) => {
    console.log(
      `Socket "${socket.id}" is trying to join party (${party}/${code})`
    )

    try {
      partyService.joinParty(party, code, socket.id)

      socket.__role = 'guest'
      socket.__party = party
      ack()
    } catch (err) {
      // TODO: Handle this properly
      ack(err)
    }
  })

  socket.on('signaling/candidate', ({ remoteId, candidate }) => {
    // TODO: Move this to a signaling service
    debugSignaling(socket.id, remoteId, 'ICECandidate', { candidate })
    socket
      .to(remoteId)
      .emit('signaling/candidate', { remoteId: socket.id, candidate })
  })

  socket.on('signaling/offer', ({ remoteId, description }) => {
    // TODO: Move this to a signaling service
    debugSignaling(socket.id, remoteId, 'Offer', { description })
    socket
      .to(remoteId)
      .emit('signaling/offer', { remoteId: socket.id, description })
  })

  socket.on('signaling/answer', ({ remoteId, description }) => {
    // TODO: Move this to a signaling service
    debugSignaling(socket.id, remoteId, 'Answer', { description })
    socket
      .to(remoteId)
      .emit('signaling/answer', { remoteId: socket.id, description })
  })

  socket.on('disconnect', () => {
    if (socket.__role === 'host') {
      console.log(
        `Host "${socket.id} has been disconnected (${socket.__party})"`
      )

      try {
        partyService.deleteParty(socket.__party)
      } catch (err) {
        // Ignore this error
      }
    } else if (socket.__role === 'guest') {
      console.log(
        `Guest "${socket.id} has been disconnected (${socket.__party})"`
      )

      try {
        partyService.leaveParty(socket.__party, socket.id)
      } catch (err) {
        // Ignore this error
      }
    }
  })
})

server.listen(process.env.PORT, () =>
  console.log(`Server running at *:${process.env.PORT}`)
)
