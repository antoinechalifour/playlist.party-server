const CreatePartyHandler = require('./Handler')
const CreatePartyCommand = require('./Command')
const CommandResponse = require('../Response')

test('Listends to the correct type', () => {
  const handler = new CreatePartyHandler()

  expect(handler.listenTo()).toBe(require('./Command').COMMAND_TYPE)
})

test('Returns an error command when the party already exists', async () => {
  const party = {
    id: 'party-id',
    name: 'Playlist.party',
    hostId: 'host-id'
  }
  const user = { userId: 'user-id' }
  const userRepository = {
    create: jest.fn().mockResolvedValue(user),
    joinAsCreator: jest.fn()
  }
  const partyRepository = {
    findByName: jest.fn().mockResolvedValue(party)
  }
  const handler = new CreatePartyHandler(userRepository, partyRepository)
  const command = new CreatePartyCommand('Playlist.party', '1234', 'host-id')

  const result = await handler.handle(command)

  expect(result).toBeInstanceOf(CommandResponse)
  expect(result.error).toEqual(
    new Error(`Party "Playlist.party" already exists`)
  )
  expect(result.events).toEqual([])
})

test('Creates the party otherwise', async () => {
  const party = {
    id: 'party-id',
    name: 'Playlist.party',
    code: '1234',
    hostId: 'host-id'
  }
  const user = { id: 'user-id' }
  const userRepository = {
    create: jest.fn().mockResolvedValue(user),
    joinAsCreator: jest.fn()
  }
  const partyRepository = {
    findByName: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue(party)
  }

  const handler = new CreatePartyHandler(userRepository, partyRepository)
  const command = new CreatePartyCommand('Playlist.party', '1234', 'host-id')

  const result = await handler.handle(command)

  expect(result).toBeInstanceOf(CommandResponse)
  expect(result.value).toEqual('party-id')
  expect(result.events).toEqual([])
  expect(userRepository.create.mock.calls.length).toBe(1)
  expect(partyRepository.create.mock.calls.length).toBe(1)
  expect(partyRepository.create.mock.calls[0]).toEqual([
    'Playlist.party',
    '1234',
    'user-id'
  ])
})
