const axios = require('axios')
const { utils: web3utils } = require('web3')
const inputRegex = /^\d+:(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])$/i

const getSponsorTransactions = (startBlock, ethAddress, etherscanApiUrl, etherscanApiKey) => {
  return axios.get(
    `${etherscanApiUrl}?module=account&action=txlist&address=${ethAddress}&startblock=${startBlock}&sort=asc&apikey=${etherscanApiKey}`
  ).then((response) => {
    return response.data.result.filter((tx) => {
      const input = web3utils.hexToUtf8(tx.input)
      return tx.to.toLowerCase() === ethAddress.toLowerCase() && inputRegex.test(input)
    })
  })
}

module.exports = getSponsorTransactions