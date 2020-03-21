require('dotenv').config();
const pkg = require('./package');
// Allow self signed certs for dev
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

module.exports = {
  mode: 'universal',
  env: {
    guestAccountKey: process.env.GUEST_ACCOUNT_KEY || '',
    scRedirectUrl: process.env.SC_REDIRECT_URL || 'http://localhost:3000/auth',
    apiUrl: process.env.API_URL || 'https://localhost:3333',
    locale: process.env.LOCALE || 'en',
  },

  /*
  ** Headers of the page
  */
  head: {
    title: 'The Magic Frog',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
      { hid: 'keywords', name: 'keywords', content: pkg.keywords.join(',') },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.1.0/css/all.css' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Berkshire+Swash' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css' },
    ],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js' },
    ],
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#FFFFFF' },

  /*
  ** Global CSS
  */
  css: [
    { src: '~assets/css/main.sass', lang: 'sass' },
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/i18n.js',
    '~/plugins/vue-hivesigner',
    { src: '~plugins/vue-notification', ssr: false },
    { src: '~/plugins/cookie-consent', ssr: false },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
  ],

  /*
  ** Build configuration
  */
  build: {
    vendor: ['steem-js-patched', 'marked', 'axios', 'vue-i18n'],
    /*
    ** You can extend webpack config here
    */
  },
};
