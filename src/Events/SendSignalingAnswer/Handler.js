const { EVENT_TYPE } = require('./Event')

module.exports = class SendSignalingAnswerEventHandler {
  constructor (userRepository, io) {
    this.userRepository = userRepository
    this.io = io
  }

  /**
   * Forwards the answer to the receiver.
   * @param {{ emitterId: string, receiverId: string, answer: string }} event - The event.
   */
  async handle (event) {
    const receiver = await this.userRepository.findById(event.receiverId)

    this.io.to(receiver.connectionId).emit('signaling/answer', {
      remoteId: event.emitterId,
      description: event.answer
    })
  }

  listenTo () {
    return EVENT_TYPE
  }
}
