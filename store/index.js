export const state = () => ({
  showUsernames: true,
  currentStory: 0
})

export const getters = {
  showUsernames (state) {
    return state.showUsernames
  },
  currentStory (state) {
    return state.currentStory
  }
}

export const mutations = {
  showUsernames (state, show) {
    state.showUsernames = show
  },
  currentStory (state, number) {
    state.currentStory = number
  }
}
