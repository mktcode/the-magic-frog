<template>
  <div v-if="sponsor" class="my-2">
    <div :class="sizeClass + ' mb-0'">
      <a :href="sponsor.url" target="__blank">{{ displayUrl }}</a>
    </div>
    <span class="text-muted">with {{ amount }} ETH</span>
  </div>
</template>

<script>
import { utils } from 'web3'

export default {
  props: {
    sponsor: {
      type: Object,
      default: null
    },
    position: {
      type: Number,
      default: 0
    }
  },
  computed: {
    amount () {
      return utils.fromWei(this.sponsor.value, 'ether')
    },
    sizeClass () {
      let sizeClass = ''
      if (this.position === 0) { sizeClass = 'h3' }
      if (this.position === 1) { sizeClass = 'h4' }
      if (this.position === 2) { sizeClass = 'h5' }
      if (this.position === 3) { sizeClass = 'h6' }
      return sizeClass
    },
    displayUrl () {
      return this.sponsor.url.replace(/https?:\/\//, '')
    }
  }
}
</script>
