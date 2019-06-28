import Vue from 'vue'
import axios from 'axios'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import moment from "moment"
import VueMomentJS from "vue-momentjs"
import { firebase } from "@firebase/app";
import "@firebase/firestore";
import { firestorePlugin } from 'vuefire'

Vue.use(VueMomentJS, moment)
Vue.use(Vuetify)
Vue.use(firestorePlugin)

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false



/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
