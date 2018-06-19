const Event = require('../Event')

const EVENT_TYPE = 'UserLeftPartyEvent'

class UserLeftPartyEvent extends Event {
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

UserLeftPartyEvent.EVENT_TYPE = EVENT_TYPE

module.exports = UserLeftPartyEvent
