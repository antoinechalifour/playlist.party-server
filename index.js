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
  await ctx.render('admin')
})

server.listen(process.env.PORT, () =>
  console.log(`Signaling server running @ http://localhost:${process.env.PORT}`)
)

// --------------------- TESTS
;(async function () {
  const JoinPartyCommand = require('./src/Commands/JoinParty/Command')
  const joinParty = new JoinPartyCommand('test', '123', null)

  const CreatePartyCommand = require('./src/Commands/CreateParty/Command')
  const createParty = new CreatePartyCommand('test', '1234', 'host-id')
  const joinParty2 = new JoinPartyCommand('test', '123', null)
  const joinParty3 = new JoinPartyCommand('test', '1234', null)

  await commandBus.dispatch(joinParty)
  await commandBus.dispatch(createParty)
  await commandBus.dispatch(joinParty2)
  await commandBus.dispatch(joinParty3)
})()
