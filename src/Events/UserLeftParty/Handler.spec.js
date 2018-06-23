const UserLeftPartyEventHandler = require('./Handler')

test('Sends the answer to the user', async () => {
  const user = {
    id: 'user-id',
    connectionId: 'connection-id'
  }
  const userRepository = {
    findById: jest.fn().mockResolvedValue(user)
  }
  const io = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn().mockReturnThis()
  }
  const event = {
    userId: 'user-id',
    partyId: 'party-id'
  }

  const handler = new UserLeftPartyEventHandler(userRepository, io)

  await handler.handle(event)

  expect(userRepository.findById.mock.calls.length).toBe(1)
  expect(userRepository.findById.mock.calls[0]).toEqual(['user-id'])
  expect(io.to.mock.calls.length).toBe(1)
  expect(io.to.mock.calls[0]).toEqual(['connection-id'])
  expect(io.emit.call.length).toBe(1)
  expect(io.emit.mock.calls[0]).toEqual(['signaling/leave'])
})
