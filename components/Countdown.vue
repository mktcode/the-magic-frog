<template>
  <div>
    <div v-if="followers < 100" class="lead bg-primary text-white rounded-xl p-3 p-sm-4" style="max-width: 500px">
      Unfortunately we are not enough storytellers yet. Only if one hundred or more are following the frog, the story can continue.<br>
      <br>
      <a href="https://twitter.com/magicstoryfrog" class="btn btn-light rounded-pill">
        <span class="h4">Follow the Frog!</span>
      </a>
      <div>and you can already</div>
      <a :href="`https://twitter.com/intent/tweet?in_reply_to=${latestTweet}&text=And then the magic frog came and saved the day.`" class="btn btn-lg btn-light rounded-pill">
        Share your idea and vote for others!
      </a>
    </div>
    <div v-else>
      <div v-if="secondsLeft">
        <p class="lead mb-0">
          The story will be continued in:
        </p>
        <h2>{{ countdown }}</h2>
        <a :href="`https://twitter.com/intent/tweet?in_reply_to=${latestTweet}&text=And then the magic frog came and saved the day.`" class="btn btn-lg btn-success rounded-pill mt-3">
          Share your idea and vote for others!
        </a>
      </div>
      <div v-else>
        <h1>Storytelling in progress.</h1>
        <p class="lead mb-0">
          Please wait a moment and refresh the page.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      followers: process.env.FOLLOWERS,
      latestTweet: process.env.LATEST_TWEET,
      secondsLeft: 86400,
      countdown: ''
    }
  },
  mounted () {
    this.updateCountdown()
    setInterval(this.updateCountdown, 60000)
  },
  methods: {
    updateCountdown () {
      this.secondsLeft = Math.max(0, process.env.NEXT_UPDATE - new Date().getTime() / 1000)
      const hours = Math.floor(this.secondsLeft / (60 * 60))
      const minutes = Math.floor((this.secondsLeft % (60 * 60)) / 60)
      this.countdown = `${hours} hours and ${minutes} minutes`
      if (hours === 0) {
        this.countdown = `${minutes} minutes`
        if (minutes <= 1) {
          this.countdown = 'one moment...'
        }
      }
    }
  }
}
</script>
