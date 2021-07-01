export const state = () => ({
  showUsernames: true
})

export const getters = {
  showUsernames (state) {
    return state.showUsernames
  }
}

export const mutations = {
  showUsernames (state, show) {
    state.showUsernames = show
  }
}
