const core = require('@actions/core')
const getSponsorTransactions = require('../get-sponsor-transactions')
const { utils: web3utils } = require('web3')
const fs = require('fs')

async function run() {
  try {
    const sponsorsFile = core.getInput('sponsors-file')
    const etherscanApiUrl = core.getInput('etherscan-api-url')
    const etherscanApiKey = core.getInput('etherscan-api-key')
    
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
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
