const core = require('@actions/core')
const sponsors = require(__dirname + '/../../../content/sponsors.json')
const getSponsorTransactions = require('../get-sponsor-transactions')
const { utils: web3utils } = require('web3')

async function run() {
  try {
    const etherscanApiUrl = core.getInput('etherscan-api-url')
    const etherscanApiKey = core.getInput('etherscan-api-key')
    const sponsorTransactions = await getSponsorTransactions(etherscanApiUrl, etherscanApiKey)
    core.info(`New sponsors found: ${JSON.stringify(sponsorTransactions)}`)
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
    core.setOutput('changed', !!sponsorTransactions.length)
    core.setOutput('json', JSON.stringify(sponsors, null, 2))
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
