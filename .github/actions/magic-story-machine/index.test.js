const getTweetReplies = require('./get-tweet-replies')
const state = require('./../../../stories/state.json')

test('get tweet replies', async () => {
  const replies = await getTweetReplies(state.currentTweetId, process.env.TWITTER_ACCESS_TOKEN, [])
  console.log(replies.length)
  expect(tweet).toBe('test')
})