jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
  sign: jest.fn()
}))
const jwt = require('jsonwebtoken')
const Service = require('./Token')

describe('decode', () => {
  test('Resolves the decoded token', async () => {
    const token = { userId: 'user-id' }
    jwt.verify.mockClear()
    jwt.verify.mockImplementation((x, y, cb) => cb(undefined, token))

    const service = new Service('test-secret')

    const result = await service.decode('my-token')

    expect(result).toEqual(token)
    expect(jwt.verify.mock.calls.length).toBe(1)
    expect(jwt.verify.mock.calls[0][0]).toBe('my-token')
    expect(jwt.verify.mock.calls[0][1]).toBe('test-secret')
  })

  test('Rejects a promise when the token cannot be decoded', () => {
    const err = new Error('Invalid token')
    jwt.verify.mockClear()
    jwt.verify.mockImplementation((token, secret, cb) => cb(err))

    const service = new Service('test-secret')

    return expect(service.decode('my-token')).rejects.toThrow('Invalid token')
  })
})
