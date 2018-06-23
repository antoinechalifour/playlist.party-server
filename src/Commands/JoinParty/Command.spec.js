const JoinPartyCommand = require('./Command')

test('Creates the correct command', () => {
  const command = new JoinPartyCommand(
    'playlist.party',
    'passcode',
    'accesstoken',
    'connection-id'
  )

  expect(command.partyName).toBe('playlist.party')
  expect(command.code).toBe('passcode')
  expect(command.accessToken).toBe('accesstoken')
  expect(command.connectionId).toBe('connection-id')
  expect(command.type).toBe('JoinPartyCommand')
})
