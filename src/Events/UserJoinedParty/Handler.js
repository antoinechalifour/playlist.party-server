const { EVENT_TYPE } = require('./Event')

module.exports = class UserJoinedPartyEventHandler {
  constructor (userRepository, partyRepository, io) {
    this.userRepository = userRepository
    this.partyRepository = partyRepository
    this.io = io
  }

  /**
   * Sends a signaling join event to the party host.
   * @param {{ userId: string, partyId: string }} event - The event.
   */
  async handle (event) {
    const party = await this.partyRepository.findById(event.partyId)
    const host = await this.userRepository.findById(party.hostId)

    this.io.to(host.connectionId).emit('signaling/join', {
      remoteId: event.userId
    })
  }

  listenTo () {
    return EVENT_TYPE
  }
}
