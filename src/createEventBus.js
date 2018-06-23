const EventBus = require('./Events/Dispatcher')
const LoggerMiddleware = require('./Events/middlewares/LoggerMiddleware')
const GuestLeftPartyHandler = require('./Events/GuestLeftParty/Handler')
const PartyDeletedEventHandler = require('./Events/PartyDeleted/Handler')
const SendSignalingAnswerHandler = require('./Events/SendSignalingAnswer/Handler')
const SendSignalingCandidateHandler = require('./Events/SendSignalingCandidate/Handler')
const SendSignalingOfferHandler = require('./Events/SendSignalingOffer/Handler')
const UserJoinedPartyHandler = require('./Events/UserJoinedParty/Handler')

/**
 * Creates the event bus.
 * @param {{ userRepository: object, partyRepository:object, io: object }} - The dependency container.
 */
module.exports = function createEventBus ({
  userRepository,
  partyRepository,
  io
}) {
  const handlers = [
    new GuestLeftPartyHandler(userRepository, partyRepository, io),
    new PartyDeletedEventHandler(userRepository, io),
    new SendSignalingAnswerHandler(userRepository, io),
    new SendSignalingCandidateHandler(userRepository, io),
    new SendSignalingOfferHandler(userRepository, io),
    new UserJoinedPartyHandler(userRepository, partyRepository, io)
  ]
  const bus = new LoggerMiddleware(new EventBus(handlers), console)

  return bus
}
