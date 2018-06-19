const SendSignalingCandidateCommand = require('./Command')

test('Creates the correct command', () => {
  const command = new SendSignalingCandidateCommand(
    'from-connection-id',
    'to-user-id',
    'ice-candidate'
  )

  expect(command.type).toBe('SendSignalingCandidateCommand')
  expect(command.from).toBe('from-connection-id')
  expect(command.to).toBe('to-user-id')
  expect(command.candidate).toBe('ice-candidate')
})
