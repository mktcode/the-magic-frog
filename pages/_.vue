<template>
  <div class="container d-flex flex-column align-items-center p-3 p-sm-4 p-md-5">
    <h1 class="mb-4">
      The Magic Frog
    </h1>
    <img src="frog.png">
    <p class="lead mt-3 text-center" style="max-width: 800px">
      Welcome, my friend! Come closer. Don't be shy. This is a magical place where magical stories are told.
      Find out <a class="cursor-pointer" @click="scrollTo('how-it-works')">how it works</a> and join the party.
      With a little luck, your creativity will even be rewarded.
    </p>
    <a ref="story-start" />
    <div class="dropdown mt-5">
      <button id="story-select" class="btn px-4 mb-2 btn-lg btn-success rounded-pill dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <span class="h2">{{ currentStory.title }} </span>
      </button>
      <ul class="dropdown-menu" aria-labelledby="story-select">
        <li v-for="story in stories" :key="story.slug">
          <a class="dropdown-item cursor-pointer" @click="scrollTo('story-start', $router.push(story.slug))">
            {{ story.title }}
          </a>
        </li>
      </ul>
    </div>
    <div v-if="topSponsor" class="text-center mt-4 mb-2 px-4 py-3 border rounded-pill">
      <h4>This story's top sponsor:</h4>
      <Sponsor :sponsor="topSponsor" :position="0" />
    </div>
    <div v-if="!currentStory.ended">
      <div class="text-center">
        <a class="cursor-pointer" @click="showSponsorForm = !showSponsorForm; scrollTo('story-start')">
          {{ showSponsorForm ? 'Hide Form' : 'Become a Sponsor and fill the Pot!' }}
        </a>
      </div>
      <div v-if="showSponsorForm" class="lead mb-0 mt-3 bg-light text-dark border p-4 rounded-xl" style="max-width: 800px">
        <h3>Sponsoring:</h3>
        You can become a story sponsor by sending ETH and a sponsor link.
        The top sponsor will be displayed at the top of the story.
        A full list of all sponsors is shown at the bottom.
        <b><u>By sponsoring a story you fill up the pot, which gets raffled among all storytellers at the end.</u></b>
        <h5 class="mt-4">
          <i>This story is sponsored by:</i>
        </h5>
        <input v-model="sponsorUrl" type="url" class="form-control form-control-lg rounded-pill" placeholder="https://">
        <div class="d-flex align-items-center mt-2">
          <input v-model="sponsorAmount" type="number" class="amount-input form-control form-control-lg rounded-pill me-2 pt-0">
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
        <small class="d-block text-center text-muted mt-4">
          25% of the sponsored amount will be used to maintain and improve the project.
          Any amount, from almost nothing to an entire kindom worth of ETH, is possible.
          Just be aware that the information is public and inappropriate links will be removed without a refund.
          If you want to support the wizard himself, without appearing as a sponsor, go <a href="https://github.com/mktcode" target="__blank">here</a>.
        </small>
      </div>
    </div>
    <h2 class="mt-4 mb-3">
      Once upon a time...
    </h2>
    <div v-if="currentStory.body.children.length">
      <button v-if="audioIsPlaying" class="btn btn-sm btn-success rounded-pill" @click="audioPause()">
        <i class="fas fa-pause" />
      </button>
      <button v-else class="btn btn-sm btn-success rounded-pill" @click="audioPlay()">
        <i class="fas fa-play" />
      </button>
      <audio ref="audio" :key="'story-' + currentStory.slug">
        <source :src="`/audio/story-${currentStory.number}.mp3?${(new Date()).getTime()}`" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
      <button class="btn btn-sm btn-outline-secondary rounded-pill ms-2" @click="$store.commit('showUsernames', !showUsernames)">
        {{ showUsernames ? 'hide usernames' : 'show usernames' }}
      </button>
    </div>
    <img src="divider.png" class="mw-100" style="transform: scaleY(-1)">
    <nuxt-content :document="currentStory" class="lead" />
    <img v-if="currentStory.body.children.length" src="divider.png" class="mw-100">
    <div v-if="currentStory.ended" class="lead mt-3 text-center">
      This story is told but a new and exciting one has already begun.<br>
      I just need your help to remember what really happened!<br>
      <a class="btn btn-success rounded-pill mt-3" @click="scrollTo('story-start', () => $router.push('/'));">
        Read the current story.
      </a>
    </div>
    <div v-else class="mb-5 mt-4 text-center">
      <h1 class="mb-5">
        To be continued!
      </h1>
      <Countdown />
    </div>
    <div v-if="currentStorySponsors.length" class="text-center">
      <img src="divider.png" class="mw-100">
      <h4>Thanks to the Sponsors!</h4>
      <Sponsor v-for="(sponsor, index) in currentStorySponsors" :key="index" :sponsor="sponsor" :position="index" />
    </div>
    <img src="divider.png" class="mw-100" style="transform: scaleY(-1)">
    <h1 class="mt-5 mb-4">
      A pot full of gold?
    </h1>
    <p class="lead">
      Yes, the rumors are true. At the end of each story this pot will be raffled! Three storytellers will be chosen by fate and luck.
      The more you have contributed to a story, the more likely fate will be on your side, unless... you are unlucky.
      You also need to follow <a href="https://twitter.com/@magicstoryfrog" class="link-success">The Magic Frog</a> in order for fate to even care about you at all.
    </p>
    <img src="pot-of-gold.png" class="my-4">
    <div v-if="potAmount" class="text-center mb-4">
      <h1><span class="text-muted">1.</span> {{ potAmountFirst }} <small class="text-muted">ETH</small></h1>
      <h2><span class="text-muted">2.</span> {{ potAmountSecond }} <small class="text-muted">ETH</small></h2>
      <h3><span class="text-muted">3.</span> {{ potAmountThird }} <small class="text-muted">ETH</small></h3>
    </div>
    <div v-else class="text-center">
      <h3>
        Empty... How unfortunate.
      </h3>
      <a class="cursor-pointer" @click="showSponsorForm = !showSponsorForm; scrollTo('story-start')">
        Become a sponsor!
      </a>
    </div>
    <a ref="how-it-works" />
    <Rules />
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
import Web3, { utils as ethUtils } from 'web3'

import sponsors from '../content/sponsors'

export default {
  scrollToTop: false,
  async asyncData ({ $content, store, params, redirect }) {
    const stories = await $content('stories').sortBy('number', 'desc').fetch()
    store.commit('stories', stories)

    if (params.pathMatch) {
      const [story] = await $content('stories').where({ slug: params.pathMatch }).limit(1).fetch()
      if (story) {
        store.commit('currentStory', story)
      } else {
        redirect('/')
      }
    } else {
      store.commit('currentStory', stories[0])
    }
  },
  data () {
    return {
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
    },
    currentStorySponsors () {
      if (sponsors[this.currentStory.number - 1]) {
        return sponsors[this.currentStory.number - 1].sort((a, b) => BigInt(a.value) < BigInt(b.value))
      }

      return []
    },
    topSponsor () {
      if (this.currentStorySponsors && this.currentStorySponsors.length) {
        return this.currentStorySponsors[0]
      }
      return null
    },
    potAmount () {
      const potAmount = this.currentStorySponsors.reduce((value, sponsor) => (value + BigInt(sponsor.value)), BigInt(0))
      return Number(ethUtils.fromWei(potAmount.toString(), 'ether')) * 0.75
    },
    potAmountFirst () {
      return (this.potAmount * 0.5).toFixed(6).replace(/0+$/, '')
    },
    potAmountSecond () {
      return (this.potAmount * 0.3).toFixed(6).replace(/0+$/, '')
    },
    potAmountThird () {
      return (this.potAmount * 0.2).toFixed(6).replace(/0+$/, '')
    }
  },
  methods: {
    scrollTo (refName, next) {
      const element = this.$refs[refName]
      element.scrollIntoView()
      if (next) {
        setTimeout(() => {
          next()
        }, 100)
      }
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
        const data = `${this.currentStory.number}:${this.sponsorUrl}`
        const bytes = new Blob([data]).size
        const extraGas = Math.ceil(bytes * 16 * 1.1) // * 1.1 as a little buffer
        web3.eth.sendTransaction({
          from: this.sponsorEthAddress,
          to: process.env.ETH_ADDRESS,
          value: ethUtils.toWei(this.sponsorAmount, 'ether'),
          data: ethUtils.toHex(data),
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
