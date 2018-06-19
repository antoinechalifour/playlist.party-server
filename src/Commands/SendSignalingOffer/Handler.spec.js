const SendSignalingOfferHandler = require('./Handler')
const SendSignalingOfferCommand = require('./Command')
const CommandResponse = require('../Response')
const SendSignalingOfferEvent = require('../../Events/SendSignalingOffer/Event')

test('Listens to the correct type', () => {
  const handler = new SendSignalingOfferHandler()

  expect(handler.listenTo()).toEqual(SendSignalingOfferCommand.COMMAND_TYPE)
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
  const command = new SendSignalingOfferCommand(
    'emitter-connection-id',
    '56',
    'offer'
  )
  const handler = new SendSignalingOfferHandler(userRepository)

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
      new SendSignalingOfferEvent('45', '56', 'offer')
    )
  )
})
