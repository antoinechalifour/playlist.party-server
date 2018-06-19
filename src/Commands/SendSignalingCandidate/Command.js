const Command = require('../Command')

const COMMAND_TYPE = 'SendSignalingCandidateCommand'

class SendSignalingCandidateCommand extends Command {
  /**
   * Builds a SendSignalingCandidateCommand
   * @param {string} from - The emitter connection id.
   * @param {string} to - The receiver user id.
   * @param {string} candidate - The offer.
   */
  constructor (from, to, candidate) {
    super(COMMAND_TYPE)

    this.from = from
    this.to = to
    this.candidate = candidate
  }
}

SendSignalingCandidateCommand.COMMAND_TYPE = COMMAND_TYPE

module.exports = SendSignalingCandidateCommand
