const SendSignalingCandidateHandler = require('./Handler')
const SendSignalingCandidateCommand = require('./Command')
const CommandResponse = require('../Response')
const SendSignalingCandidateEvent = require('../../Events/SendSignalingCandidate/Event')

test('Listens to the correct type', () => {
  const handler = new SendSignalingCandidateHandler()

  expect(handler.listenTo()).toEqual(SendSignalingCandidateCommand.COMMAND_TYPE)
})

test('Returns the correct command response', async () => {
  const emitter = {
    id: '45',
    connectionId: 'emitter-connection-id'
  }
  const receiver = {
    id: '56',
    connectionId: 'receiver-connection-id'
  }
  const userRepository = {
    findById: jest.fn().mockResolvedValue(receiver),
    findByConnectionId: jest.fn().mockResolvedValue(emitter)
  }
  const command = new SendSignalingCandidateCommand(
    'emitter-connection-id',
    '56',
    'candidate'
  )
  const handler = new SendSignalingCandidateHandler(userRepository)

  const response = await handler.handle(command)

  expect(userRepository.findByConnectionId.mock.calls.length).toBe(1)
  expect(userRepository.findByConnectionId.mock.calls[0]).toEqual([
    'emitter-connection-id'
  ])
  expect(userRepository.findById.mock.calls.length).toBe(1)
  expect(userRepository.findById.mock.calls[0]).toEqual(['56'])

  expect(response).toEqual(
    CommandResponse.withValue(
      null,
      new SendSignalingCandidateEvent('45', '56', 'candidate')
    )
  )
})
