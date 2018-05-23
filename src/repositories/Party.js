module.exports = function PartyRepository () {
  const _parties = new Map()

  return {
    create (name, code, hostId) {
      _parties.set(name, {
        name,
        code,
        hostId,
        guestsIds: []
      })
    },
    delete (name) {
      _parties.delete(name)
    },
    find (name) {
      return _parties.get(name)
    },
    addGuest (name, guestId) {
      const party = _parties.get(name)
      party.guestsIds.push(guestId)
    },
    removeGuest (name, guestId) {
      const party = _parties.get(name)
      party.guestsIds = party.guestsIds.filter(x => x !== guestId)
    }
  }
}
