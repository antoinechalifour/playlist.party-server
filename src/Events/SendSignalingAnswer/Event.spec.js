const SendSignalingAnswerEvent = require('./Event')

test('Creates the correct event', () => {
  const event = new SendSignalingAnswerEvent(
    'emitter-id',
    'receiver-id',
    'answer'
  )

  expect(event.type).toBe('SendSignalingAnswerEvent')
  expect(event.emitterId).toBe('emitter-id')
  expect(event.receiverId).toBe('receiver-id')
  expect(event.answer).toBe('answer')
})
