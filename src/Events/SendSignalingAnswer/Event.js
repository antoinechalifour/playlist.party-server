const Event = require('../Event')

const EVENT_TYPE = 'SendSignalingAnswerEvent'

class SendSignalingAnswerEvent extends Event {
  /**
   * Builds the event.
   * @param {string} emitterId - The emitter user id.
   * @param {string} receiverId - The receiver user id.
   * @param {string} answer - The answer.
   */
  constructor (emitterId, receiverId, answer) {
    super(EVENT_TYPE)

    this.emitterId = emitterId
    this.receiverId = receiverId
    this.answer = answer
  }
}

SendSignalingAnswerEvent.EVENT_TYPE = EVENT_TYPE

module.exports = SendSignalingAnswerEvent
