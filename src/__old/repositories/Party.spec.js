const PartyRepository = require('./Party')

describe('#create()', () => {
  const repo = PartyRepository()

  it('Should create a party', () => {
    repo.create('playlist.party', '1234', 'host-id')

    expect(repo.find('playlist.party')).toEqual({
      name: 'playlist.party',
      code: '1234',
      hostId: 'host-id',
      guestsIds: []
    })
  })
})

describe('#delete()', () => {
  const repo = PartyRepository()
  repo.create('playlist.party', '1234', 'host-id')

  it('Should delete the party', () => {
    repo.delete('playlist.party')

    expect(repo.find('playlist.party')).toEqual(undefined)
  })
})

describe('#addGuest()', () => {
  const repo = PartyRepository()
  repo.create('playlist.party', '1234', 'host-id')

  it('Should add the guest to the party', () => {
    repo.addGuest('playlist.party', '9876')
    repo.addGuest('playlist.party', '5432')

    expect(repo.find('playlist.party')).toEqual({
      name: 'playlist.party',
      code: '1234',
      hostId: 'host-id',
      guestsIds: ['9876', '5432']
    })
  })
})

describe('#removeGuest()', () => {
  const repo = PartyRepository()
  repo.create('playlist.party', '1234', 'host-id')
  repo.addGuest('playlist.party', '9876')
  repo.addGuest('playlist.party', '5432')

  it('Should remove the guest from the party', () => {
    repo.removeGuest('playlist.party', '9876')

    expect(repo.find('playlist.party')).toEqual({
      name: 'playlist.party',
      code: '1234',
      hostId: 'host-id',
      guestsIds: ['5432']
    })
  })
})
