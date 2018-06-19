const Dispatcher = require('./Dispatcher')
const Command = require('./Command')

test('Dispatches the command to the appropriate handler', async () => {
  class JoinPartyCommand extends Command {
    constructor () {
      super('JoinPartyCommand')
    }
  }

  const handlers = [
    {
      listenTo: () => 'LeavePartyCommand',
      handle: jest.fn()
    },
    {
      listenTo: () => 'JoinPartyCommand',
      handle: jest.fn().mockResolvedValue('command response')
    }
  ]
  const command = new JoinPartyCommand()
  const dispatcher = new Dispatcher(handlers)

  const result = await dispatcher.dispatch(command)

  expect(result).toBe('command response')
  expect(handlers[1].handle.mock.calls.length).toBe(1)
  expect(handlers[1].handle.mock.calls[0][0]).toBe(command)
})

test('Throws an error if no handler is found for the command', () => {
  class JoinPartyCommand extends Command {
    constructor () {
      super('JoinPartyCommand')
    }
  }

  const handlers = [
    {
      listenTo: () => 'LeavePartyCommand',
      handle: jest.fn()
    }
  ]
  const command = new JoinPartyCommand()
  const dispatcher = new Dispatcher(handlers)

  return expect(dispatcher.dispatch(command)).rejects.toThrow(
    'No handler found for command "JoinPartyCommand"'
  )
})
