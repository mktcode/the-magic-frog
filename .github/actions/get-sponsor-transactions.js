const axios = require('axios')
const cryptoConf = require('../../package.json').crypto
const sponsors = require('../../content/sponsors.json')
const { utils: web3utils } = require('web3')
const inputRegex = /^\d+:(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])$/i

const getSponsorTransactions = (etherscanApiKey) => {
  const startBlock = getStartBlock()
  return axios.get(
    `http://api-kovan.etherscan.io/api?module=account&action=txlist&address=${cryptoConf.address}&startblock=${startBlock}&sort=asc&apikey=${etherscanApiKey}`
  ).then((response) => {
    return response.data.result.filter((tx) => {
      const input = web3utils.hexToUtf8(tx.input)
      return tx.to.toLowerCase() === cryptoConf.address.toLowerCase() && inputRegex.test(input)
    })
  })
}

const getStartBlock = () => {
  if (sponsors.length) {
    const blockNumbers = sponsors[sponsors.length - 1].map((sponsor) => Number(sponsor.blockNumber))
    if (blockNumbers.length) {
      const highestBlockNumber = Math.max(...blockNumbers)
      return highestBlockNumber + 1
    }
  }

  return 0
}

module.exports = getSponsorTransactions