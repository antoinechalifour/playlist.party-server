const { EVENT_TYPE } = require('./Event')

module.exports = class UserJoinedPartyEventHandler {
  constructor (partyRepository, io) {
    this.partyRepository = partyRepository
    this.io = io
  }

  /**
   * Sends a signaling join event to the party host.
   * @param {{ userId: string, partyId: string }} event - The event.
   */
  async handle (event) {
    const party = await this.partyRepository.findById(event.partyId)

    this.io.to(party.hostId).emit('signaling/join', {
      remoteId: event.userId
    })
  }

  listenTo () {
    return EVENT_TYPE
  }
}
