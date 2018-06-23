const { EVENT_TYPE } = require('./Event')

module.exports = class SendSignalingOfferEventHandler {
  constructor (userRepository, io) {
    this.userRepository = userRepository
    this.io = io
  }

  /**
   * Forwards the offer to the receiver.
   * @param {{ emitterId: string, receiverId: string, offer: string }} event - The event.
   */
  async handle (event) {
    const receiver = await this.userRepository.findById(event.receiverId)

    this.io.to(receiver.connectionId).emit('signaling/offer', {
      remoteId: event.emitterId,
      description: event.offer
    })
  }

  listenTo () {
    return EVENT_TYPE
  }
}
