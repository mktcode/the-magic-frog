import { $content } from '@nuxt/content'
import pkg from './package'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  generate: {
    // generate a route for each story and the default / route, whis is not
    // automatically generated because we use only a pages/_.vue file and no index.vue
    // for each story, generate a route like /story-<num> and also, if the story has
    // a custom title: /<slug>
    // pages/_.vue redirects /story-<num> to /<slug> if possible
    async routes () {
      const stories = await $content('stories').only(['slug']).fetch()
      const routes = ['/', ...stories.map((story) => {
        return '/' + story.slug
      })]
      stories.forEach((story, index) => (routes.push('/story-' + (index + 1))))
      return routes
    }
  },

  env: {
    NEXT_UPDATE: '1626264000',
    LATEST_TWEET: '1414971274888196098',
    ETH_ADDRESS: pkg.crypto.address
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    script: [
      {
        src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js',
        integrity: 'sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM',
        crossorigin: 'anonymous'
      },
      { src: 'https://kit.fontawesome.com/963e26517d.js', crossorigin: 'anonymous' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/main.sass'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://content.nuxtjs.org/
    '@nuxt/content',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    icon: {
      fileName: 'frog.png'
    },
    manifest: {
      name: 'The Magic Frog',
      short_name: 'Magic Frog',
      lang: 'en'
    },
    meta: {
      name: 'The Magic Frog',
      ogHost: 'https://the-magic-frog.com',
      ogImage: '/cover.png',
      twitterCard: 'summary_large_image',
      nativeUI: true,
      theme_color: '#198754'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
