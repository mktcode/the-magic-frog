<template>
  <h1 class="text-center p-5">
    Using Magic Key...
  </h1>
</template>

<script>
export default {
  mounted () {
    this.$axios.get(
      `${process.env.API_URL}/access-token?oauth_verifier=${this.$route.query.oauth_verifier}&oauth_token=${this.$route.query.oauth_token}`
    ).then((response) => {
      localStorage.setItem('twitter_access_token', response.data.access_token)
      localStorage.setItem('twitter_access_token_secret', response.data.access_token_secret)
      localStorage.setItem('twitter_screen_name', response.data.screen_name)
      localStorage.setItem('twitter_user_id', response.data.user_id)
      this.$router.push('/')
    })
  }
}
</script>
