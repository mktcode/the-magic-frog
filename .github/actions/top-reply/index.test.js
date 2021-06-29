const getLatestStoryTweet = require('./get-latest-story-tweet')
const accountId = '1408717257505714179'

test('get latest story tweet with story number', async () => {
  const tweet = await getLatestStoryTweet(accountId, process.env.TWITTER_BEARER_TOKEN)
  expect(tweet.text.toLowerCase()).toMatch(/#story (\d+)/)
})