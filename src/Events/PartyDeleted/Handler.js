const { EVENT_TYPE } = require('./Event')

module.exports = class PartyDeletedEventHandler {
  /**
   * Builds the handler.
   * @param {{ findById: string => any }} userRepository
   * @param {SocketIO} io
   */
  constructor (userRepository, io) {
    this.userRepository = userRepository
    this.io = io
  }

  /**
   * Notifies the guests that the party is over.
   * @param {{ partyId: string, guests: [string]}} event
   */
  async handle (event) {
    const users = await Promise.all(
      event.guests.map(userId => this.userRepository.findById(userId))
    )

    users.forEach(user => this.io.to(user.connectionId).emit('signaling/leave'))
  }

  listenTo () {
    return EVENT_TYPE
  }
}
