const PartyDeletedEvent = require('./Event')
const Handler = require('./Handler')

test('Notifies the guests that the party is over', async () => {
  const io = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn()
  }
  const userRepository = {
    findById: jest.fn(userId =>
      Promise.resolve({
        id: userId,
        connectionId: `connection-${userId}`
      })
    )
  }
  const event = new PartyDeletedEvent('party-id', ['user-1', 'user-2'])

  const handler = new Handler(userRepository, io)

  await handler.handle(event)

  expect(userRepository.findById.mock.calls.length).toBe(2)
  expect(userRepository.findById.mock.calls).toEqual([['user-1'], ['user-2']])
  expect(io.to.mock.calls.length).toBe(2)
  expect(io.to.mock.calls).toEqual([
    ['connection-user-1'],
    ['connection-user-2']
  ])
  expect(io.emit.mock.calls.length).toBe(2)
  expect(io.emit.mock.calls).toEqual([['signaling/leave'], ['signaling/leave']])
})
