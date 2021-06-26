const core = require('@actions/core')

async function run() {
  try {
    const twitterAccessToken = core.getInput('twitter-access-token')
    core.info('Twitter Access Token starts with:', twitterAccessToken.substr(0, 3))
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
