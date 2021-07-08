export const state = () => ({
  showUsernames: true,
  stories: [],
  currentStory: null
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
  currentStory (state, story) {
    state.currentStory = story
  }
}
