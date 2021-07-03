<template>
  <div>
    <div v-if="secondsLeft">
      <p class="lead mb-0">
        The story will be continued in:
      </p>
      <h1>{{ countdown }}</h1>
    </div>
    <div v-else>
      <h1>Storytelling in progress.</h1>
      <p v-if="refreshNote" class="lead mb-0">
        Please wait a moment and refresh the page.
      </p>
      <p v-else class="lead mb-0">
        Please wait...
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      secondsLeft: 86400,
      countdown: '',
      refreshNote: false
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

      // check workflows
      if (!this.secondsLeft && !this.refreshNote) {
        this.$axios.get('https://api.github.com/repos/mktcode/the-magic-frog/actions/runs')
          .then((response) => {
            const newWorkflow = response.data.workflow_runs.find(run => run.name === 'The Magic Story Machine' && run.id > Number(process.env.LAST_WORKFLOW_RUN) && run.status === 'completed')
            if (newWorkflow) {
              window.location.reload()
            }
          })
          .catch(() => (this.refreshNote = true))
      }
    }
  }
}
</script>
