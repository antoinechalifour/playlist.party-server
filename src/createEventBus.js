const EventBus = require('./Events/Dispatcher')
const UserJoinedPartyEvent = require('./Events/UserJoinedParty/Event')

/**
 * Creates the event bus.
 * @param {SocketIo} io - The io instance.
 */
module.exports = function createEventBus (io) {
  const handlers = [
    {
      listenTo: () => UserJoinedPartyEvent.EVENT_TYPE,
      handle (event) {
        console.log('TODO: Handle:', event)
      }
    }
  ]
  const bus = new EventBus(handlers)

  return bus
}
