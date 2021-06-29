const axios = require('axios')

const getLatestStoryTweet = (accountId, bearerToken) => {
  let url = `https://api.twitter.com/2/tweets/search/recent?query=%23story from:${accountId}`
  return axios.get(url, {
    headers: {
      'Authorization': `Bearer ${bearerToken}`
    }
  }).then((response) => {
    if (response.data && response.data.meta && response.data.meta.result_count) {
      return response.data.data[0]
    }
    return null
  })
}

module.exports = getLatestStoryTweet