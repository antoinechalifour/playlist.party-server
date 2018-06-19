const Command = require('../Command')

const COMMAND_TYPE = 'JoinPartyCommand'

class JoinPartyCommand extends Command {
  /**
   * Builds a JoinParty command.
   * @param {string} partyName - The party name.
   * @param {string} code - The pass code.
   * @param {string?} accessToken - An optional access token for existing users.
   */
  constructor (partyName, code, accessToken) {
    super(COMMAND_TYPE)

    this.partyName = partyName
    this.code = code
    this.accessToken = accessToken
  }
}

JoinPartyCommand.COMMAND_TYPE = COMMAND_TYPE

module.exports = JoinPartyCommand
