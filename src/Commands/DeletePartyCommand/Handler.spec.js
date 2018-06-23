const DeletePartyCommandHandler = require('./Handler')
const DeletePartyCommand = require('./Command')
const CommandResponse = require('../Response')
const PartyDeletedevent = require('../../Events/PartyDeleted/Event')

test('Deletes the party and creates the events', async () => {
  const users = [
    {
      id: 'user-1',
      connectionId: 'connection-1',
      partyId: 'party-id'
    },
    {
      id: 'user-2',
      connectionId: 'connection-2',
      partyId: 'party-id'
    }
  ]
  const partyRepository = {
    delete: jest.fn()
  }
  const userRepository = {
    findByPartyId: jest.fn().mockResolvedValue(users)
  }

  const handler = new DeletePartyCommandHandler(userRepository, partyRepository)
  const command = new DeletePartyCommand('party-id')

  const result = await handler.handle(command)

  expect(result).toBeInstanceOf(CommandResponse)
  expect(result.value).toBe(null)
  expect(result.events).toEqual([
    new PartyDeletedevent('party-id', ['user-1', 'user-2'])
  ])

  expect(userRepository.findByPartyId.mock.calls.length).toBe(1)
  expect(userRepository.findByPartyId.mock.calls[0]).toEqual(['party-id'])
  expect(partyRepository.delete.mock.calls.length).toBe(1)
})
