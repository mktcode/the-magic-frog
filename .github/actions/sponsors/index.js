const core = require('@actions/core')
const sponsors = require('../../../content/sponsors.json')
const getSponsorTransactions = require('../get-sponsor-transactions')
const { utils: web3utils } = require('web3')
const fs = require('fs')

async function run() {
  try {
    const etherscanApiUrl = core.getInput('etherscan-api-url')
    const etherscanApiKey = core.getInput('etherscan-api-key')
    const sponsorTransactions = await getSponsorTransactions(etherscanApiUrl, etherscanApiKey)
    sponsorTransactions.forEach((tx) => {
      const input = web3utils.hexToUtf8(tx.input)
      const [ storyNumber, sponsorLink ] = input.split(':')
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
    fs.writeFileSync(__dirname + '/../../../content/sponsors.json', JSON.stringify(sponsors, null, 2))
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
