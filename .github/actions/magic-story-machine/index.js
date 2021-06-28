const core = require('@actions/core')
const getTweetReplies = require('./get-tweet-replies')
const state = require('./../../../stories/state.json')

async function run() {
  try {
    const twitterAccessToken = core.getInput('twitter-access-token')
    const replies = getTweetReplies(state.currentTweetId, twitterAccessToken)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
