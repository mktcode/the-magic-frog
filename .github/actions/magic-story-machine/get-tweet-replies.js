const axios = require('axios')

const getTweetReplies = async (id, accessToken, replies, nextToken) => {
  const fields = 'author_id,conversation_id,in_reply_to_user_id'
  let url = `https://api.twitter.com/2/tweets/search/recent?tweet.fields=${fields}&query=conversation_id:${id} -is:retweet`
  if (nextToken) {
    url += '&next_token=' + nextToken
  }
  return axios.get(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }).then((response) => {
    if (response.data.data.length) {
      replies.push(...response.data.data)
      if (response.data.meta.next_token) {
        return getTweetReplies(id, accessToken, replies, response.data.meta.next_token)
      }
      return replies
    }
    return replies
  })
}

module.exports = getTweetReplies