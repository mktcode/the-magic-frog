const getLatestStoryTweet = require('./get-latest-story-tweet')
const getTweetReplies = require('./get-tweet-replies')
const accountId = '1408717257505714179'
const bearerToken = process.env.TWITTER_BEARER_TOKEN

test('get latest story tweet with story number', async () => {
  const tweet = await getLatestStoryTweet(accountId, bearerToken)
  expect(tweet.text.toLowerCase()).toMatch(/#story (\d+)/)
})

test('get replies to latest story tweet', async () => {
  const tweet = await getLatestStoryTweet(accountId, bearerToken)
  expect(tweet.text.toLowerCase()).toMatch(/#story (\d+)/)
  const replies = await getTweetReplies(tweet.id, bearerToken, [])
  expect(Array.isArray(replies)).toBe(true)
})