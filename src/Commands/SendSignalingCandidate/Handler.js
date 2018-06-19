const SendSignalingCandidateCommand = require('./Command')
const CommandResponse = require('../Response')
const SendSignalingCandidateEvent = require('../../Events/SendSignalingCandidate/Event')

module.exports = class SendSignalingCandidateCommandHandler {
  constructor (userRepository) {
    this.userRepository = userRepository
  }

  async handle (command) {
    const emitter = await this.userRepository.findByConnectionId(command.from)
    const receiver = await this.userRepository.findById(command.to)

    return CommandResponse.withValue(
      null,
      new SendSignalingCandidateEvent(
        emitter.id,
        receiver.id,
        command.candidate
      )
    )
  }

  listenTo () {
    return SendSignalingCandidateCommand.COMMAND_TYPE
  }
}
