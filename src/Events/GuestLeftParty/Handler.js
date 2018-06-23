const { EVENT_TYPE } = require('./Event')

module.exports = class UserLeftPartyEventHandler {
  constructor (userRepository, partyRepository, io) {
    this.userRepository = userRepository
    this.partyRepository = partyRepository
    this.io = io
  }

  /**
   * Notifies the user using that the party is over.
   * @param {{ userId: string, partyId: string }} event - The event.
   */
  async handle (event) {
    const party = await this.partyRepository.findById(event.partyId)
    const host = await this.userRepository.findById(party.hostId)

    this.io
      .to(host.connectionId)
      .emit('signaling/leave', { remoteId: event.userId })
  }

  listenTo () {
    return EVENT_TYPE
  }
}
