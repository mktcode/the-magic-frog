<template>
  <div :class="{ 'my-2': showUSernames }">
    <span v-if="showUsernames" class="fw-bold username">{{ username }}:</span>
    <slot />
    <div class="text-center">
      <img v-if="image" :src="image" class="my-3" style="max-width: 800px; max-height: 800px">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    username: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters(['showUsernames'])
  }
}
</script>
