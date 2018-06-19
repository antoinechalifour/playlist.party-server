const Dispatcher = require('./Dispatcher')

test('Dispatches events to the correct handlers', async () => {
  const handlers = [
    {
      listenTo: () => 'UserJoinedPartyEvent',
      handle: jest.fn()
    },
    {
      listenTo: () => 'UserLeftPartyEvent',
      handle: jest.fn()
    },
    {
      listenTo: () => 'UserJoinedPartyEvent',
      handle: jest.fn()
    }
  ]
  const event = { type: 'UserJoinedPartyEvent' }

  const dispatcher = new Dispatcher(handlers)

  await dispatcher.dispatch(event)

  expect(handlers[0].handle.mock.calls.length).toBe(1)
  expect(handlers[0].handle.mock.calls[0][0]).toBe(event)
  expect(handlers[1].handle.mock.calls.length).toBe(0)
  expect(handlers[2].handle.mock.calls.length).toBe(1)
  expect(handlers[2].handle.mock.calls[0][0]).toBe(event)
})
