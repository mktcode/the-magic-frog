<template>
  <div class="container d-flex flex-column align-items-center p-5">
    <h1>
      The Magic Frog
    </h1>
    <div class="text-center pb-5">
      <a v-if="requestToken && requestSecret" :href="'https://api.twitter.com/oauth/authenticate?oauth_token=' + requestToken" class="mt-3 btn btn-outline-success rounded-pill">
        Enter
      </a>
      <div v-if="accessToken && screenName">
        <h4>
          Welcome <a :href="'https://twitter.com/@' + screenName" class="link-success">@{{ screenName }}</a>!
          <button class="btn btn-sm btn-outline-success rounded-pill" @click="twitterLogout">
            Leave
          </button>
        </h4>
      </div>
    </div>
    <img src="frog.png">
    <a name="story-start" />
    <div class="dropdown mt-5">
      <button id="story-select" class="btn px-4 mb-3 btn-lg btn-success rounded-pill dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <span class="h2">{{ stories[currentStory].title }}</span>
      </button>
      <ul class="dropdown-menu" aria-labelledby="story-select">
        <li v-for="(story, index) in stories" :key="story.slug">
          <a class="dropdown-item" href="#story-start" @click="currentStory = index">
            {{ stories[index].title }}
          </a>
        </li>
      </ul>
    </div>
    <h3 class="mb-0">
      Once upon a time...
    </h3>
    <img src="divider.png" style="transform: scaleY(-1)">
    <button class="btn btn-sm btn-outline-primary rounded-pill mb-5" style="margin-top: -30px; z-index: 1" @click="$store.commit('showUsernames', !showUsernames)">
      {{ showUsernames ? 'hide usernames' : 'show usernames' }}
    </button>
    <nuxt-content :document="stories[currentStory]" class="lead" />
    <img src="divider.png">
    <h2 class="mt-5">
      A pot full of gold?
    </h2>
    <img src="pot-of-gold.png" class="my-4">
    <h3>What could that possibly mean?</h3>
    <p class="lead">
      Follow <a href="https://twitter.com/@magicstoryfrog" class="link-success">@magicstoryfrog</a> to find out.
    </p>
    <small class="mt-5 text-muted">
      Made with <span class="text-danger">❤️</span> by <a href="https://github.com/mktcode" class="link-success">me.</a>
    </small>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  async asyncData ({ $content }) {
    const stories = await $content('stories').sortBy('number', 'desc').fetch()
    return { stories }
  },
  data () {
    return {
      accessToken: null,
      screenName: null,
      requestToken: null,
      requestSecret: null,
      currentStory: 0
    }
  },
  computed: {
    ...mapGetters(['showUsernames'])
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
