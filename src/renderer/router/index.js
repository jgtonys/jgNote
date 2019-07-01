import Vue from 'vue'
import Router from 'vue-router'
import NoteView from '../components/NoteView'
import EditNote from '../components/EditNote'
import NewNote from '../components/NewNote'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/noteView',
      component: NoteView
    },
    {
      path: '/newNote',
      component: NewNote
    },
    {
      path: '/editNote',
      component: EditNote
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
