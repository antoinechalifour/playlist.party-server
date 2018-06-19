const uuid = require('uuid')

module.exports = class PartyRepository {
  constructor () {
    this._parties = []
  }

  findAll () {
    return this._parties
  }

  findById (id) {
    return this._parties.find(x => x.id === id) || null
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
