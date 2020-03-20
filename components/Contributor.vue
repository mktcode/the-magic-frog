<template>
  <b-col sm="12" md="4" class="mb-4 d-flex align-items-center justify-content-end flex-column">
    <div class="flex-column">
      <h2>#{{ index + 1 }}</h2>
      <div class="contributor-profile-image" :style="{ backgroundImage: 'url(https://images.hive.blog/u/' + contributor.name + '/avatar/large)', width: imageSize + 'px', height: imageSize + 'px' }"></div>
      <h3><a :href="'https://hive.blog/@' + contributor.name" target="_blank">@{{ contributor.name }}</a></h3>
      <h5>{{ $t('halloffame.contributions') }}: {{ contributor.contributions }}</h5>
    </div>
  </b-col>
</template>

<script>
  export default {
    props: ['contributor', 'index'],
    computed: {
      imageSize() {
        // image size based on position:
        // 1st: 150px, 2nd: 100px, 3rd and following: 50px
        return this.index === 0 ? 150 : (this.index === 1 ? 100 : 50);
      }
    }
  }
</script>

<style lang="sass">
  .contributor-profile-image
    background-size: cover
    background-position: center
    border-radius: 50%
    margin: 0 auto
</style>