<template>
  <b-col sm="12" md="4" class="mb-4 d-flex align-items-center justify-content-end flex-column">
    <div class="flex-column">
      <h2>#{{ index + 1 }}</h2>
      <div class="curator-profile-image" :style="{ backgroundImage: 'url(https://images.hive.blog/u/' + curator.voter + '/avatar/large)', width: imageSize + 'px', height: imageSize + 'px' }"></div>
      <h3><a :href="'https://hive.blog/@' + curator.voter" target="_blank">@{{ curator.voter }}</a></h3>
      <h5>{{ $t('halloffame.curated') }}: {{ gestimatedHBD }} HBD</h5>
    </div>
  </b-col>
</template>

<script>

  export default {
    props: ['curator', 'index', 'rsharesToHBDFactor'],
    computed: {
      imageSize() {
        // image size based on position:
        // 1st: 150px, 2nd: 100px, 3rd and following: 50px
        return this.index === 0 ? 150 : (this.index === 1 ? 100 : 50);
      },
      gestimatedHBD() {  
        // The guess estimation of the HBD value is subject to price fluctuations.
        // Each added up vote for all post of a curator is multiplied by the pool and price factors.
        return (this.curator.rshares * this.rsharesToHBDFactor).toFixed(2);
      }
    },
  methods: {
    }
  }
</script>

<style lang="sass">
  .curator-profile-image
    background-size: cover
    background-position: center
    border-radius: 50%
    margin: 0 auto
</style>
