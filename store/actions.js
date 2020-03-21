import Vue from 'vue';
import axios from 'axios';
import steem from 'steem';

export default {
  updateData({ dispatch }) {
    dispatch('fetchPot');
    dispatch('fetchCurrentCommands');
    dispatch('fetchAllStoryPosts');
    dispatch('fetchDelegators');
    dispatch('fetchCurators');
  },
  fetchPot({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.apiUrl}/pot?account=${Vue.prototype.$account}`).then((result) => {
        commit('setPot', result.data);
        resolve(result.data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  fetchCurrentCommands({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.apiUrl}/submissions?account=${Vue.prototype.$account}`).then((result) => {
        commit('setCurrentCommands', result.data);
        resolve(result.data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  fetchStories({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.apiUrl}/stories?account=${Vue.prototype.$account}`).then((result) => {
        commit('setStories', result.data);
        resolve(result.data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  fetchAllStoryPosts({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.apiUrl}/storyposts?account=${Vue.prototype.$account}`).then((result) => {
        commit('setAllStoryPosts', result.data);
        resolve(result.data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  fetchContributors({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.apiUrl}/contributors?account=${Vue.prototype.$account}`).then((result) => {
        commit('setContributors', result.data);
        resolve(result.data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  fetchDelegators({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.apiUrl}/delegators?account=${Vue.prototype.$account}`).then((result) => {
        commit('setDelegators', result.data);
        resolve(result.data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  fetchCurators({ commit }) {
    return new Promise((resolve, reject) => {
      // Getting the top 12 curators of the frog account
      axios.get(`${process.env.apiUrl}/curators?top=100&account=${Vue.prototype.$account}`).then((result) => {
        commit('setCurators', result.data);
        resolve(result.data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  fetchRsharesToSBDFactor({ commit }) {
    return new Promise((resolve, reject) => {
      // get reward fund for posts
      steem.api.getRewardFund('post', (err, fund) => {
        if (err) reject(err);
        else {
          const rewardBalance = parseFloat(fund.reward_balance.replace(' STEEM', ''));
          const recentClaims = parseInt(fund.recent_claims, 10);

          // get SBD price factor
          steem.api.getCurrentMedianHistoryPrice((errs, price) => {
            if (errs) reject(errs);
            else {
              const SBDPrice = parseFloat(price.base.replace(' SBD', ''));
              const rsharesToSBDFactor = rewardBalance / recentClaims * SBDPrice;

              // final rshares to SBD factor
              commit('setRsharesToSBDFactor', rsharesToSBDFactor);
              resolve(rsharesToSBDFactor);
            }
          });
        }
      });
    });
  },
};
