const SendSignalingCandidateEventHandler = require('./Handler')

test('Sends the answer to the user', async () => {
  const receiver = {
    connectionId: 'connection-id'
  }
  const userRepository = {
    findById: jest.fn().mockResolvedValue(receiver)
  }
  const io = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn().mockReturnThis()
  }
  const event = {
    emitterId: 'emitter-id',
    receiverId: 'receiver-id',
    candidate: 'candidate'
  }

  const handler = new SendSignalingCandidateEventHandler(userRepository, io)

  await handler.handle(event)

  expect(userRepository.findById.mock.calls.length).toBe(1)
  expect(userRepository.findById.mock.calls[0]).toEqual(['receiver-id'])
  expect(io.to.mock.calls.length).toBe(1)
  expect(io.to.mock.calls[0]).toEqual(['connection-id'])
  expect(io.emit.call.length).toBe(1)
  expect(io.emit.mock.calls[0]).toEqual([
    'signaling/candidate',
    {
      remoteId: 'emitter-id',
      candidate: 'candidate'
    }
  ])
})
