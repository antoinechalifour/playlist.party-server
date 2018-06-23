const LeavePartyCommand = require('./Command')

test('Creates the correct command', () => {
  const command = new LeavePartyCommand('connection-id')

  expect(command.connectionId).toBe('connection-id')
  expect(command.type).toBe('LeavePartyCommand')
})
