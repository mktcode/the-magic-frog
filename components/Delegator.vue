<template>
  <b-col sm="12" md="4" class="mb-4 d-flex align-items-center justify-content-end flex-column">
    <div class="flex-column">
      <h2>#{{ index + 1 }}</h2>
      <div class="delegator-profile-image" :style="{ backgroundImage: 'url(https://images.hive.blog/u/' + delegator.delegator + '/avatar/large)', width: imageSize + 'px', height: imageSize + 'px' }"></div>
      <h3><a :href="'https://hive.blog/@' + delegator.delegator" target="_blank">@{{ delegator.delegator }}</a></h3>
      <h5>{{ $t('halloffame.delegated') }}: {{ delegator.sp.toFixed(0) }} SP</h5>
    </div>
  </b-col>
</template>

<script>
  export default {
    props: ['delegator', 'index'],
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
  .delegator-profile-image
    background-size: cover
    background-position: center
    border-radius: 50%
    margin: 0 auto
</style>
