const JoinPartyCommand = require('./Command')
const CommandResponse = require('../Response')
const UserJoinedPartyEvent = require('../../Events/UserJoinedParty/Event')

module.exports = class JoinPartyCommandHandler {
  constructor (tokenService, partyRepository, userRepository) {
    this.tokenService = tokenService
    this.partyRepository = partyRepository
    this.userRepository = userRepository
  }

  /**
   * Handles JoinParty commands.
   * @param {JoinPartyCommand} command - The command to handle
   */
  async handle (command) {
    const party = await this.partyRepository.findByName(command.partyName)

    if (!party) {
      return CommandResponse.withError(
        new Error(`Party "${command.partyName}" does not exist`)
      )
    } else if (party.code !== command.code) {
      return CommandResponse.withError(
        new Error(`Invalid passcode for party "${command.partyName}"`)
      )
    }

    if (command.accessToken) {
      const decodedToken = await this.tokenService.decode(command.accessToken)

      if (decodedToken.partyId === party.id) {
        return CommandResponse.withValue(
          command.accessToken,
          new UserJoinedPartyEvent(decodedToken.userId, party.id)
        )
      }
    }

    // The user cannot re-use its access token, we need to create a new user / access token
    const user = await this.userRepository.create()
    const accessToken = await this.tokenService.create({
      userId: user.id,
      partyId: party.id
    })

    return CommandResponse.withValue(
      accessToken,
      new UserJoinedPartyEvent(user.id, party.id)
    )
  }

  listenTo () {
    return JoinPartyCommand.COMMAND_TYPE
  }
}
