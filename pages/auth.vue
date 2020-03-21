<template>
  <b-container>
    <div class="text-center py-5">
      <img src="/avatar.png" alt=""/>
      <h1 class="pt-4">{{ message }}</h1>
      <div class="upload-spinner" v-if="loading">
        <div class="dot1"></div>
        <div class="dot2"></div>
      </div>
    </div>
  </b-container>
</template>

<script>
  export default {
    head() {
      return {
        title: this.$t('index.themagicfrog'),
        meta: [
          { hid: 'description', name: 'description', content: this.$t('index.description') }
        ]
      }
    },
    data() {
      return {
        message: this.$t('auth.openthedoor'),
        loading: true
      }
    },
    async mounted () {
      let accessToken = this.$route.query['access_token']
      if (accessToken) {
        localStorage.setItem('access_token', accessToken)
        await this.$store.dispatch('hivesigner/login')
        this.$router.push('/')
      }
    }
  }
</script>
