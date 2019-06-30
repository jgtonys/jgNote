const state = {
  main: 0,
  drawer: false,
  color: 'success',
  hideDrawerMenu: false,
  image: 'https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-2.32103624.jpg',
  sidebarBackgroundColor: 'rgba(27, 27, 27, 0.74)',
  menuId: ''
}

const getters = {
    getDrawerValue: state => {
      return state.drawer
    },
    getMenuId: state => {
      return state.menuId
    }
}

const mutations = {
  drawerToggle (state) {
    state.drawer = !state.drawer
  },
  menuIdSet (state, val) {
    state.menuId = val.payload
    console.log(state.menuId)
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  },
  drawerToggle ({ commit }) {
    commit('drawerToggle')
  },
  menuIdSet ({ commit }, payload) {
    console.log("payload is " + payload)
    commit('menuIdSet', payload)

  },
  getMenuId ( { commit, state }) {
    return state.menuId
  }

}

export default {
  state,
  mutations,
  actions,
  getters
}
