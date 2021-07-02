const core = require('@actions/core')
const Twitter = require('twitter-lite')
const getUser = require('../get-user')

async function run() {
  try {
    const lastReplyId = core.getInput('last-reply-id')
    const lastAuthorId = core.getInput('last-author-id')
    const storyNumber = core.getInput('story-number')
    const theEnd = core.getInput('the-end')
    const twitterConsumerKey = core.getInput('twitter-consumer-key')
    const twitterConsumerSecret = core.getInput('twitter-consumer-secret')
    const twitterAccessTokenKey = core.getInput('twitter-access-token-key')
    const twitterAccessTokenSecret = core.getInput('twitter-access-token-secret')
    const twitterBearerToken = core.getInput('twitter-bearer-token')
    core.info(`Is this the end? ${theEnd}`)

    const user = await getUser(lastAuthorId, twitterBearerToken)
    if (!user) {
      throw Error('User not found.')
    }

    const twitterClient = new Twitter({
      consumer_key: twitterConsumerKey,
      consumer_secret: twitterConsumerSecret,
      access_token_key: twitterAccessTokenKey,
      access_token_secret: twitterAccessTokenSecret
    })

    let status = `#Story ${storyNumber} continues. @${user.username} helped me to remember. https://twitter.com/${user.username}/status/${lastReplyId}

But what happens next? Read the full story at https://the-magic-frog.com and share your ideas below.`
    
    if (theEnd === 'true') {
      status = `Story ${storyNumber} ended! Thanks @${user.username} and everyone else.

#Story ${Number(storyNumber) + 1} begins with:

Once upon a time...`
    }

    const tweet = await twitterClient.post("statuses/update", { status })
    core.info(`Tweet ID: ${tweet.id_str}`)
    core.setOutput('tweet-id', tweet.id_str)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
