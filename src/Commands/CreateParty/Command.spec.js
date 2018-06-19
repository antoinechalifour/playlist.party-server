const CreatePartyCommand = require('./Command')

test('Creates the correct command', () => {
  const command = new CreatePartyCommand(
    'playlist.party',
    'passcode',
    'host-id'
  )

  expect(command.partyName).toBe('playlist.party')
  expect(command.code).toBe('passcode')
  expect(command.hostId).toBe('host-id')
  expect(command.type).toBe('CreatePartyCommand')
})
