<template>
  <section>
    <NavbarLoggedIn v-if="user" :user="user" />
    <NavbarLoggedOut v-else/>
    <b-container>
      <h1 class="mt-5 mb-4">{{ $t('wallet.title') }}</h1>
      <div v-if="user">
        <AccountBalance :user="user"/>
        <h2 class="mt-5 mb-4">{{ $t('wallet.history.title') }}</h2>
        <TransferHistory :user="user" />
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
  import NavbarLoggedIn from '~/components/NavbarLoggedIn'
  import NavbarLoggedOut from '~/components/NavbarLoggedOut'
  import Modals from '~/components/Modals'
  import AccountBalance from '~/components/AccountBalance'
  import TransferHistory from '~/components/TransferHistory'
  import Footer from '~/components/Footer'

  import { mapGetters } from 'vuex'

  export default {
    components: {
      NavbarLoggedIn,
      NavbarLoggedOut,
      Modals,
      AccountBalance,
      TransferHistory,
      Footer
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
      ...mapGetters('hivesigner', ['user'])
    },
    methods: {
      logoutAndGoHome() {
        // redirect user to homepage after logout
        this.$store.dispatch('hivesigner/logout')
        this.$router.push({ name: 'index' });
      }
    },
    async mounted () {
      // login
      this.$store.dispatch('hivesigner/login')
    }
  }
</script>
