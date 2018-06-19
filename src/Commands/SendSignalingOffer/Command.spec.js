const SendSignalingOfferCommand = require('./Command')

test('Creates the correct command', () => {
  const command = new SendSignalingOfferCommand(
    'from-connection-id',
    'to-user-id',
    'offer-description'
  )

  expect(command.type).toBe('SendSignalingOfferCommand')
  expect(command.from).toBe('from-connection-id')
  expect(command.to).toBe('to-user-id')
  expect(command.description).toBe('offer-description')
})
