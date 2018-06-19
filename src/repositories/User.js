const uuid = require('uuid')

module.exports = class UserRepository {
  constructor () {
    this._users = {}
  }

  create () {
    const user = {
      id: uuid.v4()
    }

    this._users[user.id] = user

    return user
  }

  joinParty (userId, partyId, connectionId) {
    this._users[userId].partyId = partyId
    this._users[userId].connectionId = connectionId
  }

  findByPartyId (partyId) {
    return Object.values(this._users).filter(x => x.partyId === partyId)
  }

  findByConnectionId (connectionId) {
    return (
      Object.values(this._users).find(x => x.connectionId === connectionId) ||
      null
    )
  }

  leaveParty (userId) {
    delete this._users[userId].partyId
    delete this._users[userId].connectionId
  }
}
