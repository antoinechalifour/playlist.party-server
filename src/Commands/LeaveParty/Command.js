const Command = require('../Command')

const COMMAND_TYPE = 'LeavePartyCommand'

class LeavePartyCommand extends Command {
  /**
   * Builds a LeaveParty command.
   * @param {string} connectionId - The connection id.
   */
  constructor (connectionId) {
    super(COMMAND_TYPE)

    this.connectionId = connectionId
  }
}

LeavePartyCommand.COMMAND_TYPE = COMMAND_TYPE

module.exports = LeavePartyCommand
