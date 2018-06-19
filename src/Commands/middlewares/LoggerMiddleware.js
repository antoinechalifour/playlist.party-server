module.exports = class LoggerMiddleware {
  /**
   * Builds the middleware
   * @param {{ dispatch: any => any }} next - The next middleware.
   * @param {object} logger - The logger.
   */
  constructor (next, logger) {
    this.next = next
    this.logger = logger
  }

  async dispatch (command) {
    const before = new Date()
    const commandType = command.type
    let response

    try {
      response = await this.next.dispatch(command)
    } catch (err) {
      this.logger.error(`[${commandType}] ERROR:`, err)
      throw err
    }

    const after = new Date()

    this.logger.log(`[${commandType}] took ${after - before}ms`, response)

    return response
  }
}
