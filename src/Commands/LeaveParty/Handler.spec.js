const LeavePartyHandler = require('./Handler')
const LeavePartyCommand = require('./Command')
const CommandResponse = require('../Response')
const GuestLeftPartyEvent = require('../../Events/GuestLeftParty/Event')

test('Listens to the correct type', () => {
  const handler = new LeavePartyHandler()

  expect(handler.listenTo()).toBe(LeavePartyCommand.COMMAND_TYPE)
})

test('Unsets the user current party and returns the command response', async () => {
  const user = {
    id: '45',
    partyId: 'party-id',
    connectionId: 'connection-id'
  }
  const userRepository = {
    findByConnectionId: jest.fn().mockResolvedValue(user),
    leaveParty: jest.fn()
  }
  const command = new LeavePartyCommand('connection-id')
  const handler = new LeavePartyHandler(userRepository)

  const response = await handler.handle(command)

  expect(userRepository.findByConnectionId.mock.calls.length).toBe(1)
  expect(userRepository.findByConnectionId.mock.calls[0]).toEqual([
    'connection-id'
  ])

  expect(userRepository.leaveParty.mock.calls.length).toBe(1)
  expect(userRepository.leaveParty.mock.calls[0]).toEqual(['45'])

  expect(response).toBeInstanceOf(CommandResponse)
  expect(response.value).toBe('45')
  expect(response.events).toEqual([new GuestLeftPartyEvent('45', 'party-id')])
})
