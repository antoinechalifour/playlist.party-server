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

  async dispatch (event) {
    const before = new Date()
    const commandType = event.type
    let response

    try {
      response = await this.next.dispatch(event)
    } catch (err) {
      this.logger.error(`(event)/${commandType} ERROR:`, {
        event,
        err
      })
      throw err
    }

    const after = new Date()

    console.log('\n---\n')
    this.logger.log(`(event)/${commandType} took ${after - before}ms`, {
      event
    })

    return response
  }
}
