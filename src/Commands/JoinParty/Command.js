const Command = require('../Command')

const COMMAND_TYPE = 'JoinPartyCommand'

class JoinPartyCommand extends Command {
  /**
   * Builds a JoinParty command.
   * @param {string} partyName - The party name.
   * @param {string} code - The pass code.
   * @param {string?} accessToken - An optional access token for existing users.
   * @param {string} connectionId - The user connection id.
   */
  constructor (partyName, code, accessToken, connectionId) {
    super(COMMAND_TYPE)

    this.partyName = partyName
    this.code = code
    this.accessToken = accessToken
    this.connectionId = connectionId
  }
}

JoinPartyCommand.COMMAND_TYPE = COMMAND_TYPE

module.exports = JoinPartyCommand
