const { EVENT_TYPE } = require('./Event')

module.exports = class SendSignalingCandidateEventHandler {
  constructor (userRepository, io) {
    this.userRepository = userRepository
    this.io = io
  }

  /**
   * Forwards ice candidates to the receiver.
   * @param {{ emitterId: string, receiverId: string, candidate: string }} event - The event.
   */
  async handle (event) {
    const receiver = await this.userRepository.findById(event.receiverId)

    this.io.to(receiver.connectionId).emit('signaling/candidate', {
      remoteId: event.emitterId,
      candidate: event.candidate
    })
  }

  listenTo () {
    return EVENT_TYPE
  }
}
