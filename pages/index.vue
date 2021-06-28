<template>
  <div class="d-flex flex-column align-items-center p-5">
    <h1>The Magic Frog</h1>
    <div class="text-center pb-5">
      <a v-if="requestToken && requestSecret" :href="'https://api.twitter.com/oauth/authenticate?oauth_token=' + requestToken" class="btn btn-primary">
        Enter
      </a>
      <div v-if="accessToken && screenName">
        <h4>Welcome <a :href="'https://twitter.com/@' + screenName">@{{ screenName }}</a>!</h4>
        <button class="btn btn-sm btn-primary" @click="twitterLogout">
          Leave
        </button>
      </div>
    </div>
    <img src="frog.png">
    <img src="divider.png">
    <h2>New stories to be told!</h2>
    <img src="pot-of-gold.png">
  </div>
</template>

<script>
export default {
  data () {
    return {
      accessToken: null,
      screenName: null,
      requestToken: null,
      requestSecret: null
    }
  },
  mounted () {
    this.accessToken = localStorage.getItem('twitter_access_token')
    this.screenName = localStorage.getItem('twitter_screen_name')
    if (!this.accessToken) {
      this.prepareTwitterLogin()
    }
  },
  methods: {
    prepareTwitterLogin () {
      this.$axios.get(process.env.API_URL + '/request').then((response) => {
        this.requestToken = response.data.request_token
        this.requestSecret = response.data.request_secret
      })
    },
    twitterLogout () {
      this.accessToken = null
      this.screenName = null
      localStorage.removeItem('twitter_access_token')
      localStorage.removeItem('twitter_access_token_secret')
      localStorage.removeItem('twitter_screen_name')
      localStorage.removeItem('twitter_user_id')
      this.prepareTwitterLogin()
    }
  }
}
</script>
