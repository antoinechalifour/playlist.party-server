const Event = require('../Event')

const EVENT_TYPE = 'GuestLeftPartyEvent'

class GuestLeftPartyEvent extends Event {
  /**
   * Builds the event.
   * @param {string} userId - The user id.
   * @param {string} partyId - The party id.
   */
  constructor (userId, partyId) {
    super(EVENT_TYPE)

    this.userId = userId
    this.partyId = partyId
  }
}

GuestLeftPartyEvent.EVENT_TYPE = EVENT_TYPE

module.exports = GuestLeftPartyEvent
