const EventDispatcherMiddleware = require('./EventDispatcher')

test('Should dispatches events to the event bus and return the response', async () => {
  const response = {
    value: 'test',
    events: [{ type: 'UserJoinedPartyEvent' }, { type: 'UserLeftPartyEvent' }]
  }
  const next = {
    dispatch: jest.fn().mockResolvedValue(response)
  }
  const eventBus = {
    dispatch: jest.fn()
  }
  const command = { type: 'JoinParty' }
  const middleware = new EventDispatcherMiddleware(next, eventBus)

  const result = await middleware.dispatch(command)

  expect(result).toBe(response)
  expect(eventBus.dispatch.mock.calls.length).toEqual(2)
  expect(eventBus.dispatch.mock.calls[0]).toEqual([response.events[0]])
  expect(eventBus.dispatch.mock.calls[1]).toEqual([response.events[1]])
})
