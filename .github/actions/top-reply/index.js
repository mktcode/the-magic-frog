const core = require('@actions/core')
const getLatestStoryTweet = require('./get-latest-story-tweet')
const getTweetReplies = require('./get-tweet-replies')
const getTweetImage = require('./get-tweet-image')

async function run() {
  try {
    const accountId = core.getInput('account-id')
    const twitterBearerToken = core.getInput('twitter-bearer-token')

    const latestStoryTweet = await getLatestStoryTweet(accountId, twitterBearerToken)
    if (!latestStoryTweet) {
      throw Error('No story tweet found!')
    }
    const foundNumber = latestStoryTweet.text.match(/#story (\d+)/i)
    if (!foundNumber) {
      throw Error('No story number found!')
    }
    const storyNumber = foundNumber[0]

    const replies = await getTweetReplies(latestStoryTweet.id, twitterBearerToken, []).filter(reply => reply.in_reply_to_user_id == accountId)

    if (replies.length) {
      const topReply = validReplies.sort((a, b) => b.public_metrics.like_count - a.public_metrics.like_count)[0]
      const image = await getTweetImage(topReply.id, twitterBearerToken)
      
      core.info(`Latest Story Tweet:`)
      core.info(`- ID: ${latestStoryTweet.id}`)
      core.info(`- Story Number: ${storyNumber}`)
      core.info('Top Reply:')
      core.info(`- ID: ${topReply.id}`)
      core.info(`- Author: ${topReply.author_id}`)
      core.info(`- Text: ${topReply.text}`)
      core.info(`- Likes: ${topReply.public_metrics.like_count}`)
      core.info(`- Image: ${image}`)

      core.setOutput('story-number', storyNumber)
      core.setOutput('reply-id', topReply.id)
      core.setOutput('author-id', topReply.author_id)
      core.setOutput('text', topReply.text)
      core.setOutput('image', image)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
