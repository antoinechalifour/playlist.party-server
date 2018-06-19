const jwt = require('jsonwebtoken')

module.exports = class TokenService {
  constructor (secret) {
    this.secret = secret
  }

  decode (token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secret, (err, decoded) => {
        if (err) {
          return reject(err)
        }

        resolve(decoded)
      })
    })
  }

  create (payload) {
    return new Promise(resolve => {
      jwt.sign(payload, this.secret, { expiresIn: '1h' }, (err, token) => {
        resolve(token)
      })
    })
  }
}
