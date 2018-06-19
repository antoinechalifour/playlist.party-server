const Event = require('../Event')

const EVENT_TYPE = 'SendSignalingCandidateEvent'

class SendSignalingCandidateEvent extends Event {
  /**
   * Builds the event.
   * @param {string} emitterId - The emitter user id.
   * @param {string} receiverConnectionId - The receiver connection id.
   * @param {string} candidate - The candidate.
   */
  constructor (emitterId, receiverConnectionId, candidate) {
    super(EVENT_TYPE)

    this.emitterId = emitterId
    this.receiverConnectionId = receiverConnectionId
    this.candidate = candidate
  }
}

SendSignalingCandidateEvent.EVENT_TYPE = EVENT_TYPE

module.exports = SendSignalingCandidateEvent
