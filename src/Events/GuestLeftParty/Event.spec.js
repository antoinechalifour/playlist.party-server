const GuestLeftPartyEvent = require('./Event')

test('Creates the correct event', () => {
  const event = new GuestLeftPartyEvent('user-id', 'party-id')

  expect(event.type).toBe('GuestLeftPartyEvent')
  expect(event.userId).toBe('user-id')
  expect(event.partyId).toBe('party-id')
})
