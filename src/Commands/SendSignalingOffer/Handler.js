const SendSignalingOfferCommand = require('./Command')
const CommandResponse = require('../Response')
const SendSignalingOfferEvent = require('../../Events/SendSignalingOffer/Event')

module.exports = class LeavePartyCommandHandler {
  constructor (userRepository) {
    this.userRepository = userRepository
  }

  async handle (command) {
    const emitter = await this.userRepository.findByConnectionId(command.from)
    const receiver = await this.userRepository.findById(command.to)

    return CommandResponse.withValue(
      null,
      new SendSignalingOfferEvent(
        emitter.id,
        receiver.connectionId,
        command.description
      )
    )
  }

  listenTo () {
    return SendSignalingOfferCommand.COMMAND_TYPE
  }
}
