const core = require('@actions/core')
const getTweetReplies = require('./get-tweet-replies')
const state = require('./../../../stories/state.json')

async function run() {
  try {
    const twitterAccessToken = core.getInput('twitter-access-token')
    const replies = getTweetReplies(state.currentTweetId, twitterAccessToken, [])
    const validReplies = replies.filter(reply => reply.in_reply_to_user_id == state.accountId)
    if (validReplies.length) {
      const topReply = validReplies.sort((a, b) => a.public_metrics.like_count > b.public_metrics.like_count).pop()
      core.info(`Top Reply: ${topReply.text}`)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
