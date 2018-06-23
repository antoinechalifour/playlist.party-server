const Command = require('../Command')

const COMMAND_TYPE = 'SendSignalingOfferCommand'

class SendSignalingOfferCommand extends Command {
  /**
   * Builds a SendSignalingOfferCommand
   * @param {string} from - The emitter connection id.
   * @param {string} to - The receiver user id.
   * @param {string} description - The offer.
   */
  constructor (from, to, description) {
    super(COMMAND_TYPE)

    this.from = from
    this.to = to
    this.description = description
  }
}

SendSignalingOfferCommand.COMMAND_TYPE = COMMAND_TYPE

module.exports = SendSignalingOfferCommand
