const { utils: web3utils } = require('web3')
const axios = require('axios')

const getUser = (id, bearerToken) => {
  return axios.get(`https://api.twitter.com/2/users/${id}?user.fields=public_metrics`, {
    headers: {
      Authorization: `Bearer ${bearerToken}`
    }
  }).then((response) => {
    if (response.data && response.data.data) {
      return response.data.data
    }
    return null
  })
}

const getTweetImage = (id, bearerToken) => {
  const fields = 'author_id'
  const url = `https://api.twitter.com/2/tweets?ids=${id}&tweet.fields=${fields}&media.fields=url&expansions=attachments.media_keys`
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${bearerToken}`
    }
  }).then((response) => {
    if (response.data && response.data.includes && response.data.includes.media) {
      return response.data.includes.media[0].url
    }
    return null
  })
}

const getTweetReplies = (id, bearerToken, replies, nextToken) => {
  const fields = 'author_id,public_metrics,in_reply_to_user_id'
  let url = `https://api.twitter.com/2/tweets/search/recent?tweet.fields=${fields}&query=conversation_id:${id} -is:retweet`
  if (nextToken) {
    url += '&next_token=' + nextToken
  }
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${bearerToken}`
    }
  }).then((response) => {
    if (response.data.data && response.data.data.length) {
      replies.push(...response.data.data)
      if (response.data.meta.next_token) {
        return getTweetReplies(id, bearerToken, replies, response.data.meta.next_token)
      }
      return replies
    }
    return replies
  })
}

const getLatestStoryTweet = (accountId, bearerToken) => {
  const url = `https://api.twitter.com/2/tweets/search/recent?query=(%23story OR %23Story) from:${accountId}`
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${bearerToken}`
    }
  }).then((response) => {
    if (response.data && response.data.meta && response.data.meta.result_count) {
      return response.data.data[0]
    }
    return null
  })
}

const getSponsorTransactions = (startBlock, ethAddress, etherscanApiUrl, etherscanApiKey) => {
  const inputRegex = /^\d+:(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#/%=~_|$?!:,.]*\)|[A-Z0-9+&@#/%=~_|$])$/i
  return axios.get(
    `${etherscanApiUrl}?module=account&action=txlist&address=${ethAddress}&startblock=${startBlock}&sort=asc&apikey=${etherscanApiKey}`
  ).then((response) => {
    return response.data.result.filter((tx) => {
      const input = web3utils.hexToUtf8(tx.input)
      return tx.to.toLowerCase() === ethAddress.toLowerCase() && inputRegex.test(input)
    })
  })
}

const getStartBlock = (sponsors) => {
  if (sponsors.length) {
    const blockNumbers = sponsors[sponsors.length - 1].map(sponsor => Number(sponsor.blockNumber))
    if (blockNumbers.length) {
      const highestBlockNumber = Math.max(...blockNumbers)
      return highestBlockNumber + 1
    }
  }

  return 0
}

const getPotAmount = (sponsors) => {
  const potAmount = sponsors.reduce((value, sponsor) => (value + BigInt(sponsor.value)), BigInt(0))
  return Number(web3utils.fromWei(potAmount.toString(), 'ether')) * 0.75
}

const getPotAmountFirst = (sponsors) => {
  return (getPotAmount(sponsors) * 0.5).toFixed(6).replace(/0+$/, '')
}

const getPotAmountSecond = (sponsors) => {
  return (getPotAmount(sponsors) * 0.3).toFixed(6).replace(/0+$/, '')
}

const getPotAmountThird = (sponsors) => {
  return (getPotAmount(sponsors) * 0.2).toFixed(6).replace(/0+$/, '')
}

const getUsersFromStory = (storyString) => {
  const regEx = /<story-part username="([A-Za-z0-9_]{1,15})"/g
  const usernames = [...storyString.matchAll(regEx)].map(match => match[1])
  return usernames
}

module.exports = {
  getUser,
  getLatestStoryTweet,
  getTweetImage,
  getTweetReplies,
  getSponsorTransactions,
  getStartBlock,
  getPotAmount,
  getPotAmountFirst,
  getPotAmountSecond,
  getPotAmountThird,
  getUsersFromStory
}
