const UserJoinedPartyEventHandler = require('./Handler')

test('Sends the answer to the user', async () => {
  const party = {
    hostId: 'host-user-id'
  }
  const host = {
    id: 'host-user-id',
    connectionId: 'connection-host-id'
  }
  const userRepository = {
    findById: jest.fn().mockResolvedValue(host)
  }
  const partyRepository = {
    findById: jest.fn().mockResolvedValue(party)
  }
  const io = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn().mockReturnThis()
  }
  const event = {
    userId: 'user-id',
    partyId: 'party-id'
  }

  const handler = new UserJoinedPartyEventHandler(
    userRepository,
    partyRepository,
    io
  )

  await handler.handle(event)

  expect(partyRepository.findById.mock.calls.length).toBe(1)
  expect(partyRepository.findById.mock.calls[0]).toEqual(['party-id'])

  expect(userRepository.findById.mock.calls.length).toBe(1)
  expect(userRepository.findById.mock.calls[0]).toEqual(['host-user-id'])

  expect(io.to.mock.calls.length).toBe(1)
  expect(io.to.mock.calls[0]).toEqual(['connection-host-id'])
  expect(io.emit.call.length).toBe(1)
  expect(io.emit.mock.calls[0]).toEqual([
    'signaling/join',
    {
      remoteId: 'user-id'
    }
  ])
})
