<template>
  <section>
    <NavbarLoggedIn v-if="user" :user="user" />
    <NavbarLoggedOut v-else />
    <b-container>
      <h1 class="my-5">{{ $t('halloffame.title') }}</h1>

      <h2>{{ $t('halloffame.sponsors') }}</h2>
      <div v-if="delegators.length">
        <b-row v-if="delegators.length">
          <Delegator v-for="(delegator, index) in delegators" :key="index" :index="index" :delegator="delegator" />
        </b-row>
      </div>
      <div class="upload-spinner" v-else>
        <div class="dot1"></div>
        <div class="dot2"></div>
      </div>

      <h2 class="mt-5 pt-5">{{ $t('halloffame.curators') }}</h2>
      <div v-if="curators.length">
        <b-row v-if="curators.length">
          <Curator v-for="(curator, index) in curators" :key="index" :index="index" :curator="curator" :rsharesToHBDFactor="rsharesToHBDFactor" />
        </b-row>
      </div>
      <div class="upload-spinner" v-else>
        <div class="dot1"></div>
        <div class="dot2"></div>
      </div>

      <h2 class="mt-5 pt-5">{{ $t('halloffame.storytellers') }}</h2>
      <div v-if="contributors.length">
        <b-row>
          <Contributor v-for="(contributor, index) in contributors" :key="index" :index="index" :contributor="contributor" />
        </b-row>
      </div>
      <div class="upload-spinner" v-else>
        <div class="dot1"></div>
        <div class="dot2"></div>
      </div>

    </b-container>
    <Footer />
    <Modals :user="user" />
  </section>
</template>

<script>
  import axios from 'axios'
  import steem from 'steem-js-patched'

  import NavbarLoggedIn from '~/components/NavbarLoggedIn'
  import NavbarLoggedOut from '~/components/NavbarLoggedOut'
  import Footer from '~/components/Footer'
  import Modals from '~/components/Modals'
  import Contributor from '~/components/Contributor'
  import Delegator from '~/components/Delegator'
  import Curator from '~/components/Curator'
 
  import { mapGetters } from 'vuex'

  export default {
    components: {
      NavbarLoggedIn,
      NavbarLoggedOut,
      Footer,
      Modals,
      Contributor,
      Delegator,
      Curator
    },
    head() {
      // localizing meta description
      return { 
        title: this.$t('index.themagicfrog'),
        meta: [
          { hid: 'description', name: 'description', content: this.$t('index.description') }
        ] 
      }
    },
    computed: {
      ...mapGetters('hivesigner', ['user']),
      ...mapGetters(['contributors', 'delegators', 'curators', 'rsharesToHBDFactor'])
    },
    async mounted () {
      // login
      this.$store.dispatch('hivesigner/login')

      // fetch data
      this.$store.dispatch('fetchContributors')
      this.$store.dispatch('fetchDelegators')
      this.$store.dispatch('fetchCurators')
      this.$store.dispatch('fetchRsharesToHBDFactor')
    },
  }
</script>
