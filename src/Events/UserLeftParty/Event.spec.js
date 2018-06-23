const UserLeftPartyEvent = require('./Event')

test('Creates the correct event', () => {
  const event = new UserLeftPartyEvent('user-id', 'party-id')

  expect(event.type).toBe('UserLeftPartyEvent')
  expect(event.userId).toBe('user-id')
  expect(event.partyId).toBe('party-id')
})
