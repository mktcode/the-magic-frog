const core = require('@actions/core')
const Twitter = require('twitter-lite')

async function run() {
  try {
    const lastReplyId = core.getInput('last-reply-id')
    const lastUsername = core.getInput('last-username')
    const storyNumber = core.getInput('story-number')
    const theEnd = core.getInput('the-end')
    const twitterConsumerKey = core.getInput('twitter-consumer-key')
    const twitterConsumerSecret = core.getInput('twitter-consumer-secret')
    const twitterAccessTokenKey = core.getInput('twitter-access-token-key')
    const twitterAccessTokenSecret = core.getInput('twitter-access-token-secret')
    core.info(`Is this the end? ${theEnd}`)

    const twitterClient = new Twitter({
      consumer_key: twitterConsumerKey,
      consumer_secret: twitterConsumerSecret,
      access_token_key: twitterAccessTokenKey,
      access_token_secret: twitterAccessTokenSecret
    })

    let status = `#Story ${storyNumber} continues. Thanks @${lastUsername} for helping me to remember. https://twitter.com/${lastUsername}/status/${lastReplyId}

But what happens next? Read the story at https://the-magic-frog.com and share your ideas below.`
    
    if (theEnd === 'true') {
      status = `Story ${storyNumber} has found its worthy end! Thanks @${lastUsername} and everyone else for helping me to remember it, after all this time.

Ready for another one?

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
