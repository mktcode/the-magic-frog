import { $content } from '@nuxt/content'
import pkg from './package'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  generate: {
    async routes () {
      const stories = await $content('stories').only(['slug']).fetch()
      return stories.map((story) => {
        return '/' + story.slug
      })
    }
  },

  env: {
    LAST_WORKFLOW_RUN: '1002640128',
    NEXT_UPDATE: '1625824800',
    LATEST_TWEET: '1412195673248874499',
    ETH_ADDRESS: pkg.crypto.address
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'The Magic Frog',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Help the magic frog to remember all his interesting and fun stories!' },
      { property: 'og:title', content: 'The Magic Frog' },
      { property: 'og:description', content: 'Help the magic frog to remember all his interesting and fun stories!' },
      { property: 'og:image', content: 'https://the-magic-frog.com/cover.png' },
      { property: 'og:url', content: 'https://the-magic-frog.com' },
      { name: 'twitter:card', content: 'summary_large_image' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
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
    manifest: {
      lang: 'en'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
