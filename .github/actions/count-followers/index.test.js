const getUser = require('../get-user')
const accountId = '1408717257505714179'
const bearerToken = process.env.TWITTER_BEARER_TOKEN

test('get follower count', async () => {
  const user = await getUser(accountId, bearerToken)
  expect(typeof user.public_metrics.followers_count).toBe('number')
})