const EventBus = require('./Events/Dispatcher')
const UserJoinedPartyHandler = require('./Events/UserJoinedParty/Handler')
const UserLeftPartyHandler = require('./Events/UserLeftParty/Handler')
const SendSignalingOfferHandler = require('./Events/SendSignalingOffer/Handler')
const SendSignalingAnswerHandler = require('./Events/SendSignalingAnswer/Handler')
const SendSignalingCandidateHandler = require('./Events/SendSignalingCandidate/Handler')

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
    new UserJoinedPartyHandler(partyRepository, io),
    new UserLeftPartyHandler(io),
    new SendSignalingOfferHandler(userRepository, io),
    new SendSignalingAnswerHandler(userRepository, io),
    new SendSignalingCandidateHandler(userRepository, io)
  ]
  const bus = new EventBus(handlers)

  return bus
}
