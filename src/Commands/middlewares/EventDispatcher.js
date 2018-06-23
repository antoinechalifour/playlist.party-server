module.exports = class EventDispatcherMiddleware {
  /**
   * Builds the middleware.
   * @param {{ dispatch: any => CommandResponse }} next - The next middleware.
   * @param {EventBus} eventBus - The event bus.
   */
  constructor (next, eventBus) {
    this.next = next
    this.eventBus = eventBus
  }

  async dispatch (command) {
    const response = await this.next.dispatch(command)

    response.events.forEach(event => this.eventBus.dispatch(event))

    return response
  }
}
