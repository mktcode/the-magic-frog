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
      <button id="story-select" class="btn px-4 mb-2 btn-lg btn-success rounded-pill dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
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
    <div v-if="!stories[currentStory].ended">
      <div class="text-center">
        <a href="#story-start" class="text-link-success" @click="showSponsorForm = !showSponsorForm">
          {{ showSponsorForm ? 'Hide Form' : 'Become a Sponsor!' }}
        </a>
      </div>
      <div v-if="showSponsorForm" class="lead mb-0 mt-3 bg-light text-dark border p-4 rounded-xl" style="max-width: 800px">
        <h3>Sponsoring:</h3>
        You can become a story sponsor by sending ETH and a sponsor link. The link with the biggest sponsored amount will be at the top of the story and included in the audio version once the story ends. All other links will be displayed below the story.
        <h5 class="mt-3">
          <i>This story is sponsored by:</i>
        </h5>
        <input v-model="sponsorUrl" type="url" class="form-control form-control-lg rounded-pill" placeholder="https://">
        <div class="d-flex align-items-center">
          <input v-model="sponsorAmount" type="number" class="amount-input">
          <span class="h3 mb-0 ml-3 fw-bold me-auto">ETH</span>
          <button v-if="ethereumEnabled" class="btn btn-success rounded-pill" :disabled="sendingSponsorship || (sponsorEthAddress && !sponsorUrlValid) || !sponsorAmount" @click="sponsorStory">
            <span v-if="sponsorEthAddress">
              <i v-if="sendingSponsorship" class="fas fa-circle-notch fa-spin" />
              {{ sendingSponsorship ? 'Waiting for confirmation...' : 'Send' }}
            </span>
            <span v-else>
              Connect Wallet
            </span>
          </button>
          <a v-else href="https://metamask.io/" target="__blank" class="btn btn-success rounded-pill">
            Install a Wallet
          </a>
        </div>
        <div v-if="showSponsorshipSuccessMessage" class="alert alert-success mt-2 mb-0 rounded-xl">
          Thank you very much for your sponsorship! It might take up to one hour for your link to appear on the website.
        </div>
        <small class="d-block text-center text-muted mt-3">
          Any amount, from almost nothing to an entire kindom worth of ETH, is possible.
          Just be aware that the information is public and inappropriate links will be removed.
          If you want to support the wizard himself, without appearing as a sponsor, go <a href="https://github.com/mktcode" target="__blank">here</a>.
        </small>
      </div>
    </div>
    <h3 class="mt-4 mb-0">
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
    <small class="mt-5 text-muted text-center">
      You found some inappropriate content on this website?<br>
      <a href="https://twitter.com/intent/tweet?in_reply_to=1412070090271494147&text=Yes%20frog!%20I%20saw%20them%20crossing%20a%20line.%20They said..." target="__blank" class="link-success">Report it please.</a>
    </small>
    <small class="mt-5 text-muted">
      Made with <span class="text-danger">❤️</span> by <a href="https://github.com/mktcode" class="link-success">me.</a>
    </small>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Web3 from 'web3'

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
      audioIsPlaying: false,
      showSponsorForm: false,
      sponsorUrl: '',
      sponsorAmount: 0,
      sendingSponsorship: false,
      sponsorEthAddress: null,
      ethereumEnabled: window.ethereum,
      showSponsorshipSuccessMessage: false
    }
  },
  computed: {
    ...mapGetters(['showUsernames', 'currentStory', 'stories']),
    sponsorUrlValid () {
      const urlRegex = /^(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#/%=~_|$?!:,.]*\)|[A-Z0-9+&@#/%=~_|$])$/i
      return urlRegex.test(this.sponsorUrl)
    }
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
    },
    sponsorStory () {
      const web3 = new Web3(window.ethereum)
      if (this.sponsorEthAddress) {
        this.sendingSponsorship = true
        this.showSponsorshipSuccessMessage = false
        const data = `${this.stories[this.currentStory].number}:${this.sponsorUrl}`
        const bytes = new Blob([data]).size
        const extraGas = Math.ceil(bytes * 16 * 1.1) // * 1.1 as a little buffer
        web3.eth.sendTransaction({
          from: this.sponsorEthAddress,
          to: process.env.ETH_ADDRESS,
          value: web3.utils.toWei(this.sponsorAmount, 'ether'),
          data: web3.utils.toHex(data),
          gas: 21000 + extraGas
        }).then((tx) => {
          this.showSponsorshipSuccessMessage = true
          this.sponsorAmount = 0
          this.sponsorUrl = ''
        }).finally(() => {
          this.sendingSponsorship = false
        })
      } else {
        web3.eth.requestAccounts((error, accounts) => {
          if (!error) {
            this.sponsorEthAddress = accounts[0]
          }
        })
      }
    }
  }
}
</script>
