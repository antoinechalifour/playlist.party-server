module.exports = function IoPartyDecorator ({ partyService, io }) {
  return {
    createParty (name, code, hostId) {
      return partyService.createParty(name, code, hostId)
    },
    joinParty (name, code, guestId) {
      const party = partyService.joinParty(name, code, guestId)

      io.to(party.hostId).emit('signaling/join', { remoteId: guestId })

      return party
    },
    leaveParty (name, guestId) {
      const party = partyService.leaveParty(name, guestId)

      io.to(party.hostId).emit('signaling/leave', { remoteId: guestId })

      return party
    },
    deleteParty (name) {
      const party = partyService.deleteParty(name)

      party.guestsIds.forEach(guestId => {
        io.to(guestId).emit('signaling/leave')
      })

      return party
    }
  }
}
