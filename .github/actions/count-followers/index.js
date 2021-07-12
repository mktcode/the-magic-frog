const core = require('@actions/core')
const { getUser } = require('../../../lib')

async function run() {
  try {
    const twitterAccountId = core.getInput('twitter-account-id')
    const twitterBearerToken = core.getInput('twitter-bearer-token')
    
    const user = await getUser(twitterAccountId, twitterBearerToken)
    if (!user) {
      throw Error('User not found.')
    }

    const count = user.public_metrics.followers_count
    core.info(`Follower count: ${count}`)
    core.setOutput('count', count)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
