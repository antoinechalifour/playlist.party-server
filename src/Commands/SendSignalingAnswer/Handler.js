const SendSignalingAnswerCommand = require('./Command')
const CommandResponse = require('../Response')
const SendSignalingAnswerEvent = require('../../Events/SendSignalingAnswer/Event')

module.exports = class SendSignalingAnswerCommandHandler {
  constructor (userRepository) {
    this.userRepository = userRepository
  }

  async handle (command) {
    const emitter = await this.userRepository.findByConnectionId(command.from)
    const receiver = await this.userRepository.findById(command.to)

    return CommandResponse.withValue(
      null,
      new SendSignalingAnswerEvent(emitter.id, receiver.id, command.description)
    )
  }

  listenTo () {
    return SendSignalingAnswerCommand.COMMAND_TYPE
  }
}
