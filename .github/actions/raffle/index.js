const fs = require('fs')
const core = require('@actions/core')
const Twitter = require('twitter-lite')
const { getUsersFromStory, getPotAmount, getPotAmountFirst, getPotAmountSecond, getPotAmountThird, potImageMediaId } = require('../../../lib')
const sponsors = require('../../../sponsors')

async function run() {
  try {
    const storyNumber = core.getInput('story-number')
    const twitterConsumerKey = core.getInput('twitter-consumer-key')
    const twitterConsumerSecret = core.getInput('twitter-consumer-secret')
    const twitterAccessTokenKey = core.getInput('twitter-access-token-key')
    const twitterAccessTokenSecret = core.getInput('twitter-access-token-secret')
    
    const storySponsors = sponsors[storyNumber - 1]
    const potAmount = storySponsors ? getPotAmount(storySponsors) : 0
    
    if (potAmount) {
      const story = fs.readFileSync(`${__dirname}/../../../content/stories/story-${storyNumber}.md`, 'utf-8')
      let users = getUsersFromStory(story)
      core.info(`Users found: ${JSON.stringify(users)}`)
  
      // pick winners
      let winners = []
      let winnerStrings = []
      winners[0] = users[Math.floor(Math.random() * users.length)]
      winnerStrings[0] = `1. @ ${winners[0]}: ${getPotAmountFirst(storySponsors)} ETH`
      users = users.filter((user) => user !== winners[0])
      if (users.length) {
        winners[1] = users[Math.floor(Math.random() * users.length)]
        winnerStrings[1] = `2. @ ${winners[1]}: ${getPotAmountSecond(storySponsors)} ETH`
        users = users.filter((user) => user !== winners[1])
        if (users.length) {
          winners[2] = users[Math.floor(Math.random() * users.length)]
          winnerStrings[2] = `3. @ ${winners[2]}: ${getPotAmountThird(storySponsors)} ETH`
        }
      }
  
      core.info(`Winners: ${winners.join(', ')}`)
  
      // tweet
      const twitterClient = new Twitter({
        consumer_key: twitterConsumerKey,
        consumer_secret: twitterConsumerSecret,
        access_token_key: twitterAccessTokenKey,
        access_token_secret: twitterAccessTokenSecret
      })
      const status = `The pot has been raffled. Congratulations to:
  
${winnerStrings.join('\n')}
  
Please leave an Ethereum address below to receive your price.`
      const tweet = await twitterClient.post('statuses/update', {
        status,
        media_ids: potImageMediaId,
        reply_settings: 'mentioned_users'
      })
      core.info(`Tweet ID: ${tweet.id_str}`)
    } else {
      core.info('No pot to be raffled.')
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
