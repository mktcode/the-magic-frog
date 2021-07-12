const crypto = require('./package').crypto
const {
  getUser,
  getUsersFromStory,
  getSponsorTransactions,
  getLatestStoryTweet,
  getTweetReplies,
  getTweetImage
} = require('./lib')

const accountId = '1408717257505714179'
const imageTweetId = '1414612317791207425'
const testStory = `---
title: Test Story
slug: test-story
number: 1
ended: true
---

<story-part username="mkt">there was a wizard...</story-part>

<story-part username="mkt" image="https://i.imgur.com/uJaJeTn.png">who had to run some errands to plan a surprise party for his little frog friend.</story-part>

<story-part username="hennifant">what caught the attention of the high council of suspicious and insatiable storks in the neighborhood</story-part>`

/**
 * To run these tests, the following env vars need to be set:
 * - TWITTER_BEARER_TOKEN
 * - ETHERSCAN_API_URL
 * - ETHERSCAN_API_KEY
 */

test('get follower count', async () => {
  const user = await getUser(accountId, process.env.TWITTER_BEARER_TOKEN)
  expect(typeof user.public_metrics.followers_count).toBe('number')
})

test('get users from story string', () => {
  const users = getUsersFromStory(testStory)
  expect(users).toEqual(['mkt', 'mkt', 'hennifant'])
})

test('get sponsors', async () => {
  const sponsorTransactions = await getSponsorTransactions(0, crypto.address, process.env.ETHERSCAN_API_URL, process.env.ETHERSCAN_API_KEY)
  expect(Array.isArray(sponsorTransactions)).toBe(true)
})

test('get latest story tweet with story number', async () => {
  const tweet = await getLatestStoryTweet(accountId, process.env.TWITTER_BEARER_TOKEN)
  expect(tweet.text.toLowerCase()).toMatch(/#story (\d+)/)
})

test('get replies to latest story tweet', async () => {
  const tweet = await getLatestStoryTweet(accountId, process.env.TWITTER_BEARER_TOKEN)
  expect(tweet.text.toLowerCase()).toMatch(/#story (\d+)/)
  const replies = await getTweetReplies(tweet.id, process.env.TWITTER_BEARER_TOKEN, [])
  expect(Array.isArray(replies)).toBe(true)
})

test('get user', async () => {
  const user = await getUser(accountId, process.env.TWITTER_BEARER_TOKEN)
  expect(user.username).toEqual('magicstoryfrog')
})

test('get tweet image', async () => {
  const image = await getTweetImage(imageTweetId, process.env.TWITTER_BEARER_TOKEN)
  expect(image).toEqual('https://pbs.twimg.com/media/E6G2ZxRX0A4f0ra.png')
})
