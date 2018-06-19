const Dispatcher = require('./Commands/Dispatcher')
const EventBusDispatcherMiddleware = require('./Commands/middlewares/EventDispatcher')
const LoggerMiddleware = require('./Commands/middlewares/LoggerMiddleware')
const CreatePartyHandler = require('./Commands/CreateParty/Handler')
const JoinPartyHandler = require('./Commands/JoinParty/Handler')
const LeavePartyHandler = require('./Commands/LeaveParty/Handler')

module.exports = function createCommandBus (eventBus, container) {
  const handlers = [
    new CreatePartyHandler(container.partyRepository),
    new JoinPartyHandler(
      container.tokenService,
      container.partyRepository,
      container.userRepository
    ),
    new LeavePartyHandler(container.userRepository)
  ]
  const bus = new LoggerMiddleware(
    new EventBusDispatcherMiddleware(new Dispatcher(handlers), eventBus),
    console
  )

  return bus
}
