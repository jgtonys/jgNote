const state = {
  main: 0,
  drawer: false,
  color: 'success',
  hideDrawerMenu: false,
  image: '',
  sidebarBackgroundColor: 'rgba(27, 27, 27, 0.74)',
  menuId: '',
  intro: false,
  selectedNote: {
    noteId: "",
    title_text: "",
    bgImage: "",
    subtitle: "",
    content_text: "",
    createdAt: "",
  }

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
  },
  setIntro (state, val) {
    state.intro = val.payload
  },
  setSelectedNote (state, val) {
    state.selectedNote = val.payload
  },
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
  },
  setIntro ({ commit }, payload) {
    commit('setIntro', payload)
  },
  getIntro ({ commit, state}) {
    return state.intro
  },
  setSelectedNote ({ commit }, payload) {
    commit('setSelectedNote', payload)
  },
  getSelectedNote ({ commit, state}) {
    return state.selectedNote
  }

}

export default {
  state,
  mutations,
  actions,
  getters
}
