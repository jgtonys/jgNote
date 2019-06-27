import Vue from 'vue'
import Router from 'vue-router'
import AnotherPage from '../components/AnotherPage'
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
      path: '/test',
      component: AnotherPage
    },
    {
      path: '/newNote',
      component: NewNote
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
