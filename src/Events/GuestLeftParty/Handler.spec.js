const UserLeftPartyEventHandler = require('./Handler')
const UserLeftPartyEvent = require('./Event')

test('Notifies the host that a user has left', async () => {
  const party = {
    id: 'party-id',
    hostId: 'host-user-id'
  }
  const host = {
    id: 'host-user-id',
    connectionId: 'host-connection-id'
  }
  const userRepository = {
    findById: jest.fn().mockResolvedValue(host)
  }
  const partyRepository = {
    findById: jest.fn().mockResolvedValue(party)
  }
  const io = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn()
  }
  const event = new UserLeftPartyEvent('user-id', 'party-id')
  const handler = new UserLeftPartyEventHandler(
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
  expect(io.to.mock.calls[0]).toEqual(['host-connection-id'])

  expect(io.emit.mock.calls.length).toBe(1)
  expect(io.emit.mock.calls[0]).toEqual([
    'signaling/leave',
    { remoteId: 'user-id' }
  ])
})
