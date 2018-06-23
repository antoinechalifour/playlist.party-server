const { EVENT_TYPE } = require('./Event')

module.exports = class UserLeftPartyEventHandler {
  constructor (userRepository, io) {
    this.userRepository = userRepository
    this.io = io
  }

  /**
   * Notifies the user using that the party is over.
   * @param {{ userId: string, partyId: string }} event - The event.
   */
  async handle (event) {
    const user = await this.userRepository.findById(event.userId)

    this.io.to(user.connectionId).emit('signaling/leave')
  }

  listenTo () {
    return EVENT_TYPE
  }
}
