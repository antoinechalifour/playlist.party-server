const Command = require('../Command')

const COMMAND_TYPE = 'CreatePartyCommand'

class CreatePartyCommand extends Command {
  /**
   * Builds a CreateParty command.
   * @param {string} partyName - The party name.
   * @param {string} code - The pass code.
   * @param {string} hostId - The host connection id.
   */
  constructor (partyName, code, hostId) {
    super(COMMAND_TYPE)

    this.partyName = partyName
    this.code = code
    this.hostId = hostId
  }
}

CreatePartyCommand.COMMAND_TYPE = COMMAND_TYPE

module.exports = CreatePartyCommand
