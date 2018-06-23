const SendSignalingAnswerCommand = require('./Command')

test('Creates the correct command', () => {
  const command = new SendSignalingAnswerCommand(
    'from-connection-id',
    'to-user-id',
    'answer-description'
  )

  expect(command.type).toBe('SendSignalingAnswerCommand')
  expect(command.from).toBe('from-connection-id')
  expect(command.to).toBe('to-user-id')
  expect(command.description).toBe('answer-description')
})
