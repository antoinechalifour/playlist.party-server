const Event = require('../Event')

const EVENT_TYPE = 'SendSignalingOfferEvent'

class SendSignalingOfferEvent extends Event {
  /**
   * Builds the event.
   * @param {string} emitterId - The emitter user id.
   * @param {string} receiverId - The receiver user id.
   * @param {string} offer - The offer.
   */
  constructor (emitterId, receiverId, offer) {
    super(EVENT_TYPE)

    this.emitterId = emitterId
    this.receiverId = receiverId
    this.offer = offer
  }
}

SendSignalingOfferEvent.EVENT_TYPE = EVENT_TYPE

module.exports = SendSignalingOfferEvent
