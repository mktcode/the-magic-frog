const core = require('@actions/core')
const getSponsorTransactions = require('../get-sponsor-transactions')
const { utils: web3utils } = require('web3')
const fs = require('fs')

async function run() {
  try {
    const sponsorsFile = core.getInput('sponsors-file')
    const etherscanApiUrl = core.getInput('etherscan-api-url')
    const etherscanApiKey = core.getInput('etherscan-api-key')
    const twitterConsumerKey = core.getInput('twitter-consumer-key')
    const twitterConsumerSecret = core.getInput('twitter-consumer-secret')
    const twitterAccessTokenKey = core.getInput('twitter-access-token-key')
    const twitterAccessTokenSecret = core.getInput('twitter-access-token-secret')
    
    const sponsorTransactions = await getSponsorTransactions(etherscanApiUrl, etherscanApiKey)
    core.info(`New sponsors found: ${JSON.stringify(sponsorTransactions)}`)

    const sponsors = JSON.parse(fs.readFileSync(sponsorsFile, 'utf-8'))
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
    if (sponsorTransactions.length) {
      const twitterClient = new Twitter({
        consumer_key: twitterConsumerKey,
        consumer_secret: twitterConsumerSecret,
        access_token_key: twitterAccessTokenKey,
        access_token_secret: twitterAccessTokenSecret
      })
      const totalEth = sponsors[sponsors.length - 1].reduce((total, sponsor) => total + BigInt(sponsor.value), BigInt('0'))
      const status = `The pot of gold just got bigger! There are now ${ Number(web3utils.fromWei(totalEth.toString(), 'ether')) * 0.75} ETH to win.`
      const tweet = await twitterClient.post('statuses/update', { status })
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
