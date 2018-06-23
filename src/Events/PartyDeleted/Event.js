const Event = require('../Event')

const EVENT_TYPE = 'PartyDeletedEvent'

class PartyDeletedEvent extends Event {
  /**
   * Builds the event.
   * @param {string} partyId - The party id.
   * @param {[string]} guestsIds - The guests ids.
   */
  constructor (partyId, guestsIds) {
    super(EVENT_TYPE)

    this.partyId = partyId
    this.guests = guestsIds
  }
}

PartyDeletedEvent.EVENT_TYPE = EVENT_TYPE

module.exports = PartyDeletedEvent
