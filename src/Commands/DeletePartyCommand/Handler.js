const CommandResponse = require('../Response')
const DeletePartyCommand = require('./Command')
const PartyDeletedEvent = require('../../Events/PartyDeleted/Event')

module.exports = class DeletePartyHandler {
  /**
   * Builds the handler.
   * @param {{ findByPartyId: string => [] }} userRepository
   * @param {{ delete: function }} partyRepository
   */
  constructor (userRepository, partyRepository) {
    this.userRepository = userRepository
    this.partyRepository = partyRepository
  }

  /**
   * Deletes the party and notifies guests.
   * @param {{ partyId: string }} command - The command.
   */
  async handle (command) {
    const users = await this.userRepository.findByPartyId(command.partyId)

    await this.partyRepository.delete(command.partyId)

    return CommandResponse.withValue(
      null,
      new PartyDeletedEvent(command.partyId, users.map(x => x.id))
    )
  }

  listenTo () {
    return DeletePartyCommand.COMMAND_TYPE
  }
}
