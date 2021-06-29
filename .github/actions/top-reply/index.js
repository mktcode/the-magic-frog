const core = require('@actions/core')
const getTweetReplies = require('./get-tweet-replies')
const getTweetImage = require('./get-tweet-image')

async function run() {
  try {
    const accountId = core.getInput('account-id')
    const tweetId = core.getInput('tweet-id')
    const twitterBearerToken = core.getInput('twitter-bearer-token')

    const replies = await getTweetReplies(tweetId, twitterBearerToken, []).filter(reply => reply.in_reply_to_user_id == accountId)

    if (replies.length) {
      const topReply = validReplies.sort((a, b) => b.public_metrics.like_count - a.public_metrics.like_count)[0]
      const image = await getTweetImage(topReply.id, twitterBearerToken)
      
      core.info('Top Reply:')
      core.info(`ID: ${topReply.id}`)
      core.info(`Author: ${topReply.author_id}`)
      core.info(`Text: ${topReply.text}`)
      core.info(`Likes: ${topReply.public_metrics.like_count}`)
      core.info(`Image: ${image}`)

      core.setOutput('id', topReply.id)
      core.setOutput('author-id', topReply.author_id)
      core.setOutput('text', topReply.text)
      core.setOutput('image', image)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
