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
const JoinPartyCommand = require('./src/Commands/JoinParty/Command')
const LeavePartyCommand = require('./src/Commands/LeaveParty/Command')
const SendSignalingOfferCommand = require('./src/Commands/SendSignalingOffer/Command')

const container = {
  tokenService: new TokenService(process.env.JWT_SECRET),
  partyRepository: new PartyRepository(),
  userRepository: new UserRepository()
}

const app = new Koa()
const server = http.createServer(app.callback())
const io = Io(server)

const eventBus = createEventBus(io)
const commandBus = createCommandBus(eventBus, container)

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
  socket.on('party/create', async ({ party, code }, ack) => {
    const response = await commandBus.dispatch(
      new CreatePartyCommand(party, code, socket.id)
    )

    if (response.error) {
      ack(response.error)
    } else {
      socket.__role = 'host'
      ack()
    }
  })

  socket.on('party/join', async ({ party, code, accessToken }, ack) => {
    const response = await commandBus.dispatch(
      new JoinPartyCommand(party, code, accessToken)
    )

    if (response.error) {
      ack(response.error)
    } else {
      socket.__role = 'guest'
      ack()
    }
  })

  socket.on('signaling/offer', async ({ remoteId, description }) => {
    await commandBus.dispatch(
      new SendSignalingOfferCommand(socket.id, remoteId, description)
    )
  })

  socket.on('signaling/answer', ({ remoteId, description }) => {
    // TODO:
  })

  socket.on('signaling/candidate', ({ remoteId, candidate }) => {
    // TODO:
  })

  socket.on('disconnect', async () => {
    // TODO:
    if (socket.__role === 'host') {
    } else {
      await commandBus.dispatch(new LeavePartyCommand(socket.id))
    }
  })
})

// --------------------- TESTS
;(async function () {
  const joinParty = new JoinPartyCommand('test', '123', null, 'con-1')

  const createParty = new CreatePartyCommand('test', '1234', 'host-id')
  const joinParty2 = new JoinPartyCommand('test', '123', null, 'con-2')

  await commandBus.dispatch(joinParty)
  await commandBus.dispatch(createParty)
  await commandBus.dispatch(joinParty2)
  await commandBus.dispatch(new JoinPartyCommand('test', '1234', null, 'con-3'))
  await commandBus.dispatch(new JoinPartyCommand('test', '1234', null, 'con-4'))
  await commandBus.dispatch(new JoinPartyCommand('test', '1234', null, 'con-5'))
  await commandBus.dispatch(new JoinPartyCommand('test', '1234', null, 'con-6'))
  await commandBus.dispatch(new JoinPartyCommand('test', '1234', null, 'con-7'))
  await commandBus.dispatch(new LeavePartyCommand('con-5'))
})()
