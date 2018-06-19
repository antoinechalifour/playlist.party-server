class CommandResponse {
  /**
   * Builds the command response.
   * @param {any} value - The command success response.
   * @param {Error} error - The command error response.
   * @param {[]} events - The side effects events.
   */
  constructor (value, error, events = []) {
    this.value = value
    this.error = error
    this.events = events
  }
}

CommandResponse.withValue = (value, ...events) =>
  new CommandResponse(value, null, events)

CommandResponse.withError = (error, ...events) =>
  new CommandResponse(null, error, events)

module.exports = CommandResponse
