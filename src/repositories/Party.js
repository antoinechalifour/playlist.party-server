const uuid = require('uuid')

module.exports = class PartyRepository {
  constructor () {
    this._parties = []
  }

  create (name, code, hostId) {
    const party = {
      id: uuid.v4(),
      name,
      code,
      hostId
    }
    this._parties.push(party)

    return party
  }

  findByName (name) {
    return this._parties.find(x => x.name === name) || null
  }
}
