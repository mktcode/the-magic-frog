<template>
  <div class="text-center mb-3">
    <div v-if="part.appendText" v-html="appendHtml"></div>
    <div v-if="part.image" class="mb-1">
      <img :src="part.image" alt="" class="img-fluid" style="max-width: 100%; width: 800px;" />
    </div>
    <h3 v-if="part.type === 'end'">{{ $t('index.form.theend') }}</h3>
    <sup class="text-muted" v-if="showUsernames">{{ $t('footer.by') }} <a :href="'https://hive.blog/@' + part.author" target="_blank">@{{ part.author }}</a></sup>
  </div>
</template>

<script>
  import marked from 'marked'
  import { mapGetters } from 'vuex'

  export default {
    props: ['part'],
    computed: {
      ...mapGetters(['showUsernames']),
      appendHtml() {
        return marked(this.part.appendText);
      }
    }
  }
</script>
