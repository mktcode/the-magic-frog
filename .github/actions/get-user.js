const axios = require('axios')

const getUser = (id, bearerToken) => {
  return axios.get(`https://api.twitter.com/2/users/${id}?user.fields=public_metrics`, {
    headers: {
      'Authorization': `Bearer ${bearerToken}`
    }
  }).then((response) => {
    if (response.data && response.data.data) {
      return response.data.data
    }
    return null
  })
}

module.exports = getUser