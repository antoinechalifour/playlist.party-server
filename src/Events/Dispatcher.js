class EventBus {
  /**
   * Builds the event bus dispatcher.
   * @param {[{ listenTo: () => boolean, handle: any => void }]} handlers
   */
  constructor (handlers) {
    this.handlers = handlers
  }

  /**
   * Dispatches the event to the handlers.
   * @param {{ type: String }} event
   */
  async dispatch (event) {
    await Promise.all(
      this.handlers
        .filter(x => x.listenTo() === event.type)
        .map(handler => handler.handle(event))
    )
  }
}

module.exports = EventBus
