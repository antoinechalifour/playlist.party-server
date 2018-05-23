const PartyService = require('./Party')

describe('#createParty()', () => {
  it('Should throw an error when the party already exists', () => {
    const partyRepository = {
      find: jest.fn(name => ({
        name,
        code: '1234'
      }))
    }

    const service = PartyService({ partyRepository })

    expect(() =>
      service.createParty('playlist.party', '9876', 'host-id')
    ).toThrow()
  })

  it('Should create the party otherwise', () => {
    const partyRepository = {
      find: jest.fn(() => null),
      create: jest.fn()
    }

    const service = PartyService({ partyRepository })

    service.createParty('playlist.party', '4567', 'host-id')

    expect(partyRepository.create.mock.calls.length).toEqual(1)
    expect(partyRepository.create.mock.calls[0]).toEqual([
      'playlist.party',
      '4567',
      'host-id'
    ])
  })
})

describe('#joinParty()', () => {
  it('Should throw when the party does not exist', () => {
    const partyRepository = {
      find: jest.fn(() => null)
    }

    const service = PartyService({ partyRepository })

    expect(() =>
      service.joinParty('playslit.party', '1234', 'guest-id')
    ).toThrow()
  })

  it('Should throw when the code is invalid', () => {
    const party = {
      name: 'playlist.party',
      code: '1234',
      hostId: 'host-id',
      guestsIds: []
    }
    const partyRepository = {
      find: jest.fn(() => party)
    }

    const service = PartyService({ partyRepository })

    expect(() =>
      service.joinParty('playlist.party', 'invalid-code', 'guest-id')
    ).toThrow()
  })

  it('Should add the guest otherwise', () => {
    const party = {
      name: 'playlist.party',
      code: '1234',
      hostId: 'host-id',
      guestsIds: []
    }
    const partyRepository = {
      find: jest.fn(() => party),
      addGuest: jest.fn()
    }

    const service = PartyService({ partyRepository })

    service.joinParty('playlist.party', '1234', 'guest-id')

    expect(partyRepository.addGuest.mock.calls.length).toEqual(1)
    expect(partyRepository.addGuest.mock.calls[0]).toEqual([
      'playlist.party',
      'guest-id'
    ])
  })
})

describe('#leaveParty()', () => {
  it('Should throw when the party does not exist', () => {
    const partyRepository = {
      find: jest.fn(() => null)
    }

    const service = PartyService({ partyRepository })

    expect(() => service.leaveParty('playlist.party')).toThrow()
  })

  it('Should delete the guest otherwise', () => {
    const party = {
      name: 'playlist.party',
      code: '1325',
      hostId: 'host-id',
      guestsIds: ['1234']
    }
    const partyRepository = {
      find: jest.fn(() => party),
      removeGuest: jest.fn()
    }

    const service = PartyService({ partyRepository })

    service.leaveParty('playlist.party', '1234')

    expect(partyRepository.removeGuest.mock.calls.length).toEqual(1)
    expect(partyRepository.removeGuest.mock.calls[0]).toEqual([
      'playlist.party',
      '1234'
    ])
  })
})

describe('#deleteParty()', () => {
  it('Should throw when the party does not exist', () => {
    const partyRepository = {
      find: jest.fn(() => null)
    }

    const service = PartyService({ partyRepository })

    expect(() => service.deleteParty('playlist.party')).toThrow()
  })

  it('Should delete the party otherwise', () => {
    const party = {
      name: 'playlist.party',
      code: '5678',
      hostId: 'host-id',
      guestsId: []
    }
    const partyRepository = {
      find: jest.fn(() => party),
      delete: jest.fn()
    }

    const service = PartyService({ partyRepository })

    service.deleteParty('playlist.party')

    expect(partyRepository.delete.mock.calls.length).toEqual(1)
    expect(partyRepository.delete.mock.calls[0]).toEqual(['playlist.party'])
  })
})
