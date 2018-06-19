const uuid = require('uuid')

module.exports = class UserRepository {
  constructor () {
    this._users = {}
  }

  create (connectionId) {
    const user = {
      id: uuid.v4(),
      connectionId
    }

    this._users[user.id] = user

    return user
  }
}
