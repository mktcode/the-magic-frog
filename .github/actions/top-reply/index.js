const core = require('@actions/core')
const getLatestStoryTweet = require('../get-latest-story-tweet')
const getTweetReplies = require('../get-tweet-replies')
const getTweetImage = require('../get-tweet-image')
const getUser = require('../get-user')

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
    const storyNumber = foundNumber[1]

    const replies = (await getTweetReplies(latestStoryTweet.id, twitterBearerToken, [])).filter(reply => reply.in_reply_to_user_id == accountId)

    if (replies.length) {
      const topReply = replies.sort((a, b) => b.public_metrics.like_count - a.public_metrics.like_count)[0]
      // https://www.regextester.com/53716
      const urlRegex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/ig
      const image = await getTweetImage(topReply.id, twitterBearerToken)
      const text = topReply.text.replace(urlRegex, '').replace('@magicstoryfrog ', '')
      const textClean = text.replace('#', '').replace("\n", ' ')
      if (!text) {
        throw Error('No text found!')
      }
      const user = await getUser(topReply.author_id, twitterBearerToken)
      if (!user) {
        throw Error('User not found.')
      }
      
      core.info(`Latest Story Tweet:`)
      core.info(`- ID: ${latestStoryTweet.id}`)
      core.info(`- Story Number: ${storyNumber}`)
      core.info('Top Reply:')
      core.info(`- ID: ${topReply.id}`)
      core.info(`- Author: ${user.username}`)
      core.info(`- Text: ${text}`)
      core.info(`- Clean Text: ${textClean}`)
      core.info(`- Likes: ${topReply.public_metrics.like_count}`)
      core.info(`- Image: ${image}`)

      core.setOutput('story-number', storyNumber)
      core.setOutput('reply-id', topReply.id)
      core.setOutput('username', user.username)
      core.setOutput('text', text)
      core.setOutput('text-clean', textClean)
      core.setOutput('image', image)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
