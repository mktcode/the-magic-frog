const fs = require('fs')
const core = require('@actions/core')
const { utils: web3utils } = require('web3')
const Twitter = require('twitter-lite')
const { getSponsorTransactions, getStartBlock, getPotAmountAll, potImageMediaId } = require('../../../lib')

async function run() {
  try {
    const ethAddress = core.getInput('eth-address')
    const sponsorsFile = core.getInput('sponsors-file')
    const etherscanApiUrl = core.getInput('etherscan-api-url')
    const etherscanApiKey = core.getInput('etherscan-api-key')
    const twitterConsumerKey = core.getInput('twitter-consumer-key')
    const twitterConsumerSecret = core.getInput('twitter-consumer-secret')
    const twitterAccessTokenKey = core.getInput('twitter-access-token-key')
    const twitterAccessTokenSecret = core.getInput('twitter-access-token-secret')
    
    const sponsors = JSON.parse(fs.readFileSync(sponsorsFile, 'utf-8'))
    const startBlock = getStartBlock(sponsors)
    const sponsorTransactions = await getSponsorTransactions(startBlock, ethAddress, etherscanApiUrl, etherscanApiKey)
    core.info(`New sponsors found: ${JSON.stringify(sponsorTransactions)}`)

    if (sponsorTransactions.length) {
      // update file
      sponsorTransactions.forEach((tx) => {
        const input = web3utils.hexToUtf8(tx.input)
        const [ storyNumber, sponsorLink ] = input.split(/:(.+)/)
        if (!sponsors[Number(storyNumber) - 1]) {
          sponsors[Number(storyNumber) - 1] = []
        }
        sponsors[Number(storyNumber) - 1].push({
          blockNumber: tx.blockNumber,
          transactionHash: tx.transactionHash,
          url: sponsorLink,
          value: tx.value
        })
      })
      fs.writeFileSync(sponsorsFile, JSON.stringify(sponsors, null, 2))

      // tweet
      const twitterClient = new Twitter({
        consumer_key: twitterConsumerKey,
        consumer_secret: twitterConsumerSecret,
        access_token_key: twitterAccessTokenKey,
        access_token_secret: twitterAccessTokenSecret
      })
      const potAmount = getPotAmountAll(sponsors[sponsors.length - 1])
      const status = `The pot just got bigger! There are now ${potAmount} ETH to win.`
      const tweet = await twitterClient.post('statuses/update', { status, media_ids: potImageMediaId })
      core.info(`Tweet ID: ${tweet.id_str}`)
      core.setOutput('changed', true)
    } else {
      core.setOutput('changed', false)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
