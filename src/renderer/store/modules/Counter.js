const state = {
  main: 0,
  drawer: false,
  color: 'success',
  image: 'https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-2.32103624.jpg',
  sidebarBackgroundColor: 'rgba(27, 27, 27, 0.74)'
}

const getters = {
    getDrawerValue: state => {
      return state.drawer
    }
}

const mutations = {
  DECREMENT_MAIN_COUNTER (state) {
    state.main--
  },
  INCREMENT_MAIN_COUNTER (state) {
    state.main++
  },
  drawerToggle (state) {
    state.drawer = !state.drawer
    console.log(state.drawer)
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  },
  drawerToggle ({ commit }) {
    commit('drawerToggle')
  }

}

export default {
  state,
  mutations,
  actions
}
