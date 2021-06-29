const axios = require('axios')

const getTweetImage = (id, bearerToken) => {
  const fields = 'author_id'
  let url = `https://api.twitter.com/2/tweets?ids=${id}&tweet.fields=${fields}&media.fields=url&expansions=attachments.media_keys`
  return axios.get(url, {
    headers: {
      'Authorization': `Bearer ${bearerToken}`
    }
  }).then((response) => {
    if (response.data && response.data.includes && response.data.includes.media) {
      return response.data.includes.media[0].url
    }
    return null
  })
}

module.exports = getTweetImage