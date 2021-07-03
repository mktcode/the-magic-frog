export const state = () => ({
  showUsernames: true,
  stories: [],
  currentStory: 0
})

export const getters = {
  showUsernames (state) {
    return state.showUsernames
  },
  stories (state) {
    return state.stories
  },
  currentStory (state) {
    return state.currentStory
  }
}

export const mutations = {
  showUsernames (state, show) {
    state.showUsernames = show
  },
  stories (state, stories) {
    state.stories = stories
  },
  currentStory (state, number) {
    state.currentStory = number
  }
}
