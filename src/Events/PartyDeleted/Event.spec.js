const PartyDeleted = require('./Event')

test('Creates the correct event', () => {
  const guests = ['user-1', 'user-2']
  const event = new PartyDeleted('party-id', guests)

  expect(event.type).toBe('PartyDeletedEvent')
  expect(event.partyId).toBe('party-id')
  expect(event.guests).toBe(guests)
})
