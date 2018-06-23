const LeavePartyCommand = require('./Command')
const CommandResponse = require('../Response')
const GuestLeftPartyEvent = require('../../Events/GuestLeftParty/Event')

module.exports = class LeavePartyCommandHandler {
  constructor (userRepository) {
    this.userRepository = userRepository
  }

  async handle (command) {
    const user = await this.userRepository.findByConnectionId(
      command.connectionId
    )
    const partyId = user.partyId

    await this.userRepository.leaveParty(user.id)

    return CommandResponse.withValue(
      user.id,
      new GuestLeftPartyEvent(user.id, partyId)
    )
  }

  listenTo () {
    return LeavePartyCommand.COMMAND_TYPE
  }
}
