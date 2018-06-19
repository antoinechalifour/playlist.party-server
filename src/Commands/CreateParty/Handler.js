const CreatePartyCommand = require('./Command')
const CommandResponse = require('../Response')

module.exports = class CreatePartyHandler {
  /**
   * Builds the handler.
   * @param {{ findByName: name => Promise>}} partyRepository
   */
  constructor (userRepository, partyRepository) {
    this.userRepository = userRepository
    this.partyRepository = partyRepository
  }

  /**
   * Handles the CreateParty command.
   * @param {{ partyName: string, code: string, hostId: string}} command - The command.
   */
  async handle (command) {
    const user = await this.userRepository.create()
    const existingParty = await this.partyRepository.findByName(
      command.partyName
    )

    if (existingParty) {
      await this.userRepository.joinAsCreator(
        user.id,
        existingParty.id,
        command.hostId
      )

      return CommandResponse.withError(
        new Error(`Party "${command.partyName}" already exists`)
      )
    }

    const party = await this.partyRepository.create(
      command.partyName,
      command.code,
      command.hostId
    )

    await this.userRepository.joinAsCreator(user.id, party.id, command.hostId)

    return CommandResponse.withValue(party.id)
  }

  listenTo () {
    return CreatePartyCommand.COMMAND_TYPE
  }
}
