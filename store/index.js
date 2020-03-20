import Vue from 'vue';
import Vuex from 'vuex';

import getters from './getters';
import mutations from './mutations';
import actions from './actions';

const createStore = () => new Vuex.Store({
  state: {
    pot: { // current pot value (HBD balance of frog account)
      total: 0,
      delegators: 0, // total * 0.25
      curators: 0, // total * 0.25
      winner: 0, // total * 0.25
      others: 0, // total * 0.25
    },
    currentCommands: [], // submissions of the current day
    stories: [], // every story's last post
    allStoryPosts: [], // all posts from all stories
    contributors: [], // everyone who contributed to a story (in current language)
    delegators: [], // with amount of delegation
    curators: [], // with overall rshares contributed to the project
    rsharesToHBDFactor: null, // multiply rshares by this factor to get HBD value
    showUsernames: true, // whether to show usernames in the story
  },
  getters,
  mutations,
  actions,
  modules: {
    steemconnect: Vue.SteemConnectStore,
  },
});

export default createStore;
