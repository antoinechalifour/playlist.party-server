const DeletePartyCommand = require('./Command')

test('Creates the correct command', () => {
  const command = new DeletePartyCommand('party-id')

  expect(command.partyId).toBe('party-id')
})
