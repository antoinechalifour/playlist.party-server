const SendSignalingOfferEvent = require('./Event')

test('Creates the correct event', () => {
  const event = new SendSignalingOfferEvent(
    'emitter-id',
    'receiver-id',
    'offer'
  )

  expect(event.type).toBe('SendSignalingOfferEvent')
  expect(event.emitterId).toBe('emitter-id')
  expect(event.receiverId).toBe('receiver-id')
  expect(event.offer).toBe('offer')
})
