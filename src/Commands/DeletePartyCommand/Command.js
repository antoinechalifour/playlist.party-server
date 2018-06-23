const Command = require('../Command')

const COMMAND_TYPE = 'DeletePartyCommand'

class DeletePartyCommand extends Command {
  /**
   * Builds a DeleteParty command.
   * @param {string} partyId - The party id.
   */
  constructor (partyId) {
    super(COMMAND_TYPE)

    this.partyId = partyId
  }
}

DeletePartyCommand.COMMAND_TYPE = COMMAND_TYPE

module.exports = DeletePartyCommand
