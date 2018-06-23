const SendSignalingCandidateEvent = require('./Event')

test('Creates the correct event', () => {
  const event = new SendSignalingCandidateEvent(
    'emitter-id',
    'receiver-id',
    'candidate'
  )

  expect(event.type).toBe('SendSignalingCandidateEvent')
  expect(event.emitterId).toBe('emitter-id')
  expect(event.receiverId).toBe('receiver-id')
  expect(event.candidate).toBe('candidate')
})
