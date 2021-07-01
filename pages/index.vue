<template>
  <div class="d-flex flex-column align-items-center p-5">
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
        <span class="h2">{{ storyTitle(currentStory) }}</span>
      </button>
      <ul class="dropdown-menu" aria-labelledby="story-select">
        <li v-for="(story, index) in stories" :key="story.slug">
          <a class="dropdown-item" href="#story-start" @click="currentStory = index">
            {{ storyTitle(index) }}
          </a>
        </li>
      </ul>
    </div>
    <h3 class="mb-0">
      Once upon a time...
    </h3>
    <img src="divider.png" style="transform: scaleY(-1)">
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
export default {
  async asyncData ({ $content }) {
    const stories = await $content('stories').sortBy('createdAt', 'desc').fetch()
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
  mounted () {
    this.accessToken = localStorage.getItem('twitter_access_token')
    this.screenName = localStorage.getItem('twitter_screen_name')
    if (!this.accessToken) {
      this.prepareTwitterLogin()
    }
  },
  methods: {
    storyTitle (index) {
      return this.stories[index].slug[0].toUpperCase() + this.stories[index].slug.substring(1).replace('-', ' ')
    },
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
