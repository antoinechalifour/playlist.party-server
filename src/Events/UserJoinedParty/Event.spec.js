const UserJoinedPartyEvent = require('./Event')

test('Creates the correct event', () => {
  const event = new UserJoinedPartyEvent('user-id', 'party-id')

  expect(event.type).toBe('UserJoinedPartyEvent')
  expect(event.userId).toBe('user-id')
  expect(event.partyId).toBe('party-id')
})
