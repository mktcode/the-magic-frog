import Vue from 'vue';
import VueHiveSigner from 'vue-hivesigner';

Vue.use(VueHiveSigner, {
  app: 'themagicfrog.app',
  callbackURL: process.env.scRedirectUrl,
});
