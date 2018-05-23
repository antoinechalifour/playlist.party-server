const NamedError = require('../NamedError')

const EXISTING_PARTY = 'existing_party'
const UNKNOWN_PARTY = 'unknown_party'
const INVALID_CODE = 'invalid_code'

module.exports = function PartyService ({ partyRepository }) {
  return {
    createParty (name, code, hostId) {
      const existingParty = partyRepository.find(name)

      if (existingParty) {
        throw NamedError(`Party "${name}" already exists`, EXISTING_PARTY)
      }

      partyRepository.create(name, code, hostId)
    },
    joinParty (name, code, guestId) {
      const party = partyRepository.find(name)

      if (!party) {
        throw NamedError(`Party "${name}" does not exist`, UNKNOWN_PARTY)
      }

      if (party.code !== code) {
        throw NamedError(`Invalid code for party "${name}"`, INVALID_CODE)
      }

      partyRepository.addGuest(name, guestId)
    },
    leaveParty (name, guestId) {
      const party = partyRepository.find(name)

      if (!party) {
        throw NamedError(`Party "${name}" does not exist`)
      }

      partyRepository.removeGuest(name, guestId)
    },
    deleteParty (name) {
      const party = partyRepository.find(name)

      if (!party) {
        throw NamedError(`Party "${name}" does not exist`)
      }

      partyRepository.delete(name)
    }
  }
}
