<template>
  <div :class="{ 'my-2': showUsernames }">
    <span v-if="showUsernames" class="fw-bold username">
      <a v-if="stories[currentStory].number > 2" :href="'https://twitter.com/' + username" target="__blank">@{{ username }}:</a>
      <a v-else :href="'https://hive.blog/@' + username" target="__blank">@{{ username }}:</a>
    </span>
    <slot />
    <div class="text-center">
      <img v-if="image" :src="image" class="my-3 mw-100" style="max-height: 800px">
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
    ...mapGetters(['showUsernames', 'currentStory', 'stories'])
  }
}
</script>
