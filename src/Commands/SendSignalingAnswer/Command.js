const Command = require('../Command')

const COMMAND_TYPE = 'SendSignalingAnswerCommand'

class SendSignalingAnswerCommand extends Command {
  /**
   * Builds a SendSignalingAnswerCommand
   * @param {string} from - The emitter connection id.
   * @param {string} to - The receiver user id.
   * @param {string} description - The answer.
   */
  constructor (from, to, description) {
    super(COMMAND_TYPE)

    this.from = from
    this.to = to
    this.description = description
  }
}

SendSignalingAnswerCommand.COMMAND_TYPE = COMMAND_TYPE

module.exports = SendSignalingAnswerCommand
