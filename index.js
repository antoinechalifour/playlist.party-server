require('dotenv').config()

const http = require('http')
const Koa = require('koa')
const Io = require('socket.io')
const render = require('koa-ejs')
const path = require('path')

const TokenService = require('./src/services/Token')
const UserRepository = require('./src/repositories/User')
const PartyRepository = require('./src/repositories/Party')
const createEventBus = require('./src/createEventBus')
const createCommandBus = require('./src/createCommandBus')

const CreatePartyCommand = require('./src/Commands/CreateParty/Command')
const DeletePartyCommand = require('./src/Commands/DeletePartyCommand/Command')
const JoinPartyCommand = require('./src/Commands/JoinParty/Command')
const LeavePartyCommand = require('./src/Commands/LeaveParty/Command')
const SendSignalingOfferCommand = require('./src/Commands/SendSignalingOffer/Command')
const SendSignalingAnswerCommand = require('./src/Commands/SendSignalingAnswer/Command')
const SendSignalingCandidateCommand = require('./src/Commands/SendSignalingCandidate/Command')

const app = new Koa()
const server = http.createServer(app.callback())
const io = Io(server)

const tokenService = new TokenService(process.env.JWT_SECRET)
const partyRepository = new PartyRepository()
const userRepository = new UserRepository()

const container = {
  tokenService,
  partyRepository,
  userRepository,
  io
}

const eventBus = createEventBus(container)
const commandBus = createCommandBus(Object.assign({}, container, { eventBus }))

render(app, {
  root: path.join(__dirname, 'views'),
  viewExt: 'ejs',
  layout: false,
  cache: false,
  debug: false
})

app.use(async function (ctx) {
  const parties = container.partyRepository.findAll()

  const data = parties.map(party => ({
    party: party,
    users: container.userRepository.findByPartyId(party.id)
  }))

  await ctx.render('admin', { data })
})

server.listen(process.env.PORT, () =>
  console.log(`Signaling server running @ http://localhost:${process.env.PORT}`)
)

io.on('connection', socket => {
  socket.__data = {}

  socket.on('party/create', async ({ party, code }, ack) => {
    const response = await commandBus.dispatch(
      new CreatePartyCommand(party, code, socket.id)
    )

    if (response.error) {
      ack(response.error.message)
    } else {
      socket.__data.role = 'host'
      socket.__data.partyId = response.value

      ack()
    }
  })

  socket.on('party/join', async ({ party, code, accessToken }, ack) => {
    const response = await commandBus.dispatch(
      new JoinPartyCommand(party, code, accessToken, socket.id)
    )

    if (response.error) {
      ack(response.error.message)
    } else {
      socket.__data.role = 'guest'

      ack(null, { accessToken: response.value })
    }
  })

  socket.on('signaling/offer', async ({ remoteId, description }) => {
    await commandBus.dispatch(
      new SendSignalingOfferCommand(socket.id, remoteId, description)
    )
  })

  socket.on('signaling/answer', async ({ remoteId, description }) => {
    await commandBus.dispatch(
      new SendSignalingAnswerCommand(socket.id, remoteId, description)
    )
  })

  socket.on('signaling/candidate', async ({ remoteId, candidate }) => {
    await commandBus.dispatch(
      new SendSignalingCandidateCommand(socket.id, remoteId, candidate)
    )
  })

  socket.on('disconnect', async () => {
    if (socket.__data.role === 'host') {
      await commandBus.dispatch(new DeletePartyCommand(socket.__data.partyId))
    } else if (socket.__data.role === 'guest') {
      await commandBus.dispatch(new LeavePartyCommand(socket.id))
    }
  })
})

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error)
})

// --------------------- TESTS
// ;(async function () {
//   const joinParty = new JoinPartyCommand('test', '123', null, 'con-1')

//   const createParty = new CreatePartyCommand('test', '1234', 'host-id')
//   const joinParty2 = new JoinPartyCommand('test', '123', null, 'con-2')

//   await commandBus.dispatch(joinParty)
//   await commandBus.dispatch(createParty)
//   await commandBus.dispatch(joinParty2)
//   await commandBus.dispatch(new JoinPartyCommand('test', '1234', null, 'con-3'))
//   await commandBus.dispatch(new JoinPartyCommand('test', '1234', null, 'con-4'))
//   await commandBus.dispatch(new JoinPartyCommand('test', '1234', null, 'con-5'))
//   await commandBus.dispatch(new JoinPartyCommand('test', '1234', null, 'con-6'))
//   await commandBus.dispatch(new JoinPartyCommand('test', '1234', null, 'con-7'))
//   await commandBus.dispatch(new LeavePartyCommand('con-5'))
// })()
