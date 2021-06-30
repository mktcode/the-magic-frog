const getUser = require('./get-user')
const accountId = '1408717257505714179'
const bearerToken = process.env.TWITTER_BEARER_TOKEN

test('get user', async () => {
  const user = await getUser(accountId, bearerToken)
  expect(user.username).toEqual('magicstoryfrog')
})