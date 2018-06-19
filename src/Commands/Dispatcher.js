module.exports = class CommandBus {
  /**
   * Builds the command bus dispatcher.
   * @param {[{ listenTo: () => string, handle: ({ type: string }) => any}]} handlers
   */
  constructor (handlers) {
    this.handlers = handlers.reduce((acc, handler) => {
      acc[handler.listenTo()] = handler
      return acc
    }, {})
  }

  /**
   * Dispatches the command to the appropriate handler.
   * @param {{ type: string }} command
   */
  async dispatch (command) {
    const type = command.type
    const handler = this.handlers[type]

    if (!handler) {
      throw new Error(`No handler found for command "${type}"`)
    }

    return handler.handle(command)
  }
}
