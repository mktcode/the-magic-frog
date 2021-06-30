const core = require('@actions/core')
const Twitter = require('twitter-lite')
const getUser = require('./get-user')

async function run() {
  try {
    const lastReplyId = core.getInput('last-reply-id')
    const lastAuthorId = core.getInput('last-author-id')
    const storyNumber = core.getInput('story-number')
    const theEnd = core.getInput('the-end')
    const twitterBearerToken = core.getInput('twitter-bearer-token')
    core.info(`Is this the end? ${theEnd}`)

    const user = await getUser(lastAuthorId, twitterBearerToken)
    if (!user) {
      throw Error('User not found.')
    }

    const twitterClient = new Twitter({
      bearer_token: twitterBearerToken
    })

    let status = `#Story ${storyNumber} continues. @${user.username} helped me to remember. https://twitter.com/${user.username}/status/${lastReplyId}

But what happens next? Read the full story at https://the-magic-frog.com and share your ideas below.`
    
    if (theEnd) {
      status = `Story ${storyNumber} ended! Thanks @${user.username} and everyone else.

#Story ${Number(storyNumber) + 1} begins with:

Once upon a time...`
    }

    const tweet = await twitterClient.post("statuses/update", { status })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
