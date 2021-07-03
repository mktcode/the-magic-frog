<template>
  <div class="container d-flex flex-column align-items-center p-5">
    <h1 class="mb-4">
      The Magic Frog
    </h1>
    <!-- <div class="text-center pb-5">
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
    </div> -->
    <img src="frog.png">
    <a name="story-start" />
    <div class="dropdown mt-5">
      <button id="story-select" class="btn px-4 mb-3 btn-lg btn-success rounded-pill dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <span class="h2">{{ stories[currentStory].title }} </span>
      </button>
      <ul class="dropdown-menu" aria-labelledby="story-select">
        <li v-for="(story, index) in stories" :key="story.slug">
          <a class="dropdown-item" href="#story-start" @click="$store.commit('currentStory', index)">
            {{ stories[index].title }}
          </a>
        </li>
      </ul>
    </div>
    <h3 class="mb-0">
      Once upon a time...
    </h3>
    <img src="divider.png" style="transform: scaleY(-1)">
    <div v-if="stories[currentStory].body.children.length" class="mb-5" style="margin-top: -30px; z-index: 1">
      <button v-if="audioIsPlaying" class="btn btn-sm btn-success rounded-pill" @click="audioPause()">
        <i class="fas fa-pause" />
      </button>
      <button v-else class="btn btn-sm btn-success rounded-pill" @click="audioPlay()">
        <i class="fas fa-play" />
      </button>
      <audio ref="audio" :key="'story-' + currentStory">
        <source :src="`/audio/story-${stories[currentStory].number}.mp3?${(new Date()).getTime()}`" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
      <button class="btn btn-sm btn-outline-secondary rounded-pill ms-2" @click="$store.commit('showUsernames', !showUsernames)">
        {{ showUsernames ? 'hide usernames' : 'show usernames' }}
      </button>
    </div>
    <nuxt-content :document="stories[currentStory]" class="lead" />
    <img v-if="stories[currentStory].body.children.length" src="divider.png">
    <div v-if="stories[currentStory].ended" class="lead mt-3 text-center">
      This story is told but a new and exciting one has already begun.<br>
      I just need your help to remember what really happened!<br>
      <a key="read-current" href="#story-start" class="btn btn-success rounded-pill mt-3" @click="$store.commit('currentStory', 0)">
        Read the current story.
      </a>
    </div>
    <div v-else class="my-5 text-center">
      <Countdown />
      <a :href="'https://twitter.com/magicstoryfrog/status/' + latestTweet" target="__blank" class="btn btn-lg btn-success rounded-pill mt-3">
        Share your idea and vote for others!
      </a>
    </div>
    <img src="divider.png" style="transform: scaleY(-1)">
    <Rules />
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
  async asyncData ({ $content, store }) {
    store.commit('stories', await $content('stories').sortBy('number', 'desc').fetch())
  },
  data () {
    return {
      accessToken: null,
      screenName: null,
      requestToken: null,
      requestSecret: null,
      latestTweet: process.env.LATEST_TWEET,
      audioIsPlaying: false
    }
  },
  computed: {
    ...mapGetters(['showUsernames', 'currentStory', 'stories'])
  },
  watch: {
    currentStory () {
      this.audioPause()
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
    },
    audioPlay () {
      if (this.$refs.audio) {
        this.$refs.audio.play()
        this.audioIsPlaying = true
      }
    },
    audioPause () {
      if (this.$refs.audio) {
        this.$refs.audio.pause()
        this.audioIsPlaying = false
      }
    }
  }
}
</script>
