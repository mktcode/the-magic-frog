const getSponsorTransactions = require('../get-sponsor-transactions')

test('get sponsors', async () => {
  const sponsorTransactions = await getSponsorTransactions(process.env.ETHERSCAN_API_KEY)
  expect(Array.isArray(sponsorTransactions)).toBe(true)
})