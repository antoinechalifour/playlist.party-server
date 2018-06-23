const Dispatcher = require('./Commands/Dispatcher')
const EventBusDispatcherMiddleware = require('./Commands/middlewares/EventDispatcher')
const LoggerMiddleware = require('./Commands/middlewares/LoggerMiddleware')
const CreatePartyHandler = require('./Commands/CreateParty/Handler')
const JoinPartyHandler = require('./Commands/JoinParty/Handler')
const LeavePartyHandler = require('./Commands/LeaveParty/Handler')
const SendSignalingOfferHandler = require('./Commands/SendSignalingOffer/Handler')
const SendSignalingAnswerHandler = require('./Commands/SendSignalingAnswer/Handler')
const SendSignalingCandidateHandler = require('./Commands/SendSignalingCandidate/Handler')

module.exports = function createCommandBus ({
  eventBus,
  tokenService,
  partyRepository,
  userRepository
}) {
  const handlers = [
    new CreatePartyHandler(userRepository, partyRepository),
    new JoinPartyHandler(tokenService, partyRepository, userRepository),
    new LeavePartyHandler(userRepository),
    new SendSignalingOfferHandler(userRepository),
    new SendSignalingAnswerHandler(userRepository),
    new SendSignalingCandidateHandler(userRepository)
  ]
  const bus = new LoggerMiddleware(
    new EventBusDispatcherMiddleware(new Dispatcher(handlers), eventBus),
    console
  )

  return bus
}
