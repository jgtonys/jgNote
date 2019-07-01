const Vuex = require('vuex');

console.log("store is loaded!")

const store = new Vuex.Store({
  state: {
    main: 0,
    drawer: false,
    color: 'success',
    hideDrawerMenu: false,
    image: 'https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-2.32103624.jpg',
    sidebarBackgroundColor: 'rgba(27, 27, 27, 0.74)',
    menuId: '',
    intro: false,
    noteId: "",
    title_text: "",
    bgImage: "",
    subtitle: "",
    content_text: "",
    createdAt: "",
  },
  getters: {
      getDrawerValue: state => {
        return state.drawer
      },
      getMenuId: state => {
        return state.menuId
      }
  },
  mutations: {
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
      let note = val.payload
      state.noteId = note.id
      state.title_text = note.title_text
      state.bgImage = note.bgImage
      state.subtitle = note.subtitle
      state.content_text = note.content_text
      state.createdAt = note.createdAt
    },
  },
  actions: {
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
    }
  }
})
