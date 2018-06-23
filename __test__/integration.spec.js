require('dotenv').config()
const path = require('path')
const { fork } = require('child_process')
const io = require('socket.io-client')

const SERVER_PORT = process.env.PORT
const SERVER_URL = `http://localhost:${SERVER_PORT}`
let serverProcess

beforeAll(async () => {
  serverProcess = fork(path.join(__dirname, '../index.js'))
  const socket = io.connect(SERVER_URL)

  console.log('Waiting for server to start...')
  await new Promise(resolve => socket.on('connect', resolve))
  console.log('Done!')

  socket.disconnect()
})

test('Works as a signaling server :)', async () => {
  const hostSocket = io.connect(SERVER_URL)
  let clientSocket
  let result

  // Create the party
  await new Promise(resolve =>
    hostSocket.emit(
      'party/create',
      { party: 'integration-test', code: '9876' },
      resolve
    )
  )

  // Join with valid pass code (without access token)
  clientSocket = io.connect(SERVER_URL)
  result = await new Promise(resolve =>
    clientSocket.emit(
      'party/join',
      {
        party: 'integration-test',
        code: '9876'
      },
      (err, data) => resolve({ err, data })
    )
  )

  expect(result.err).toBe(null)
  expect(result.data.accessToken).toBeDefined()

  const accessToken = result.data.accessToken
  clientSocket.disconnect()

  // Join with an access token
  clientSocket = io.connect(SERVER_URL)
  result = await new Promise(resolve =>
    clientSocket.emit(
      'party/join',
      {
        party: 'integration-test',
        code: '9876',
        accessToken
      },
      (err, data) => resolve({ err, data })
    )
  )

  expect(result.err).toBe(null)
  expect(result.data.accessToken).toBe(accessToken)

  // Try to create the same party
  const failedHost = io.connect(SERVER_URL)
  result = await new Promise(resolve =>
    hostSocket.emit(
      'party/create',
      { party: 'integration-test', code: '9876' },
      err => resolve(err)
    )
  )

  expect(result).toBe('Party "integration-test" already exists')

  failedHost.disconnect()
})

afterAll(() => {
  console.log('Killing server...')
  serverProcess.kill('SIGINT')
})
