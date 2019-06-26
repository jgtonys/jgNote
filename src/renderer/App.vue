<template>
<div id="app">
  <v-app>
    <v-navigation-drawer id="app-drawer" v-model="drawer" dark app fixed mobile-break-point="991" width="260">
      <v-img src="https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-2.32103624.jpg" gradient="rgba(27, 27, 27, 0.74),rgba(27, 27, 27, 0.74)" height="100%">
        <v-layout class="fill-height" tag="v-list" column>
          <v-list-tile avatar>
            <v-list-tile-avatar color="white">
            </v-list-tile-avatar>
            <v-list-tile-title>
              jgNote
            </v-list-tile-title>
          </v-list-tile>
          <v-divider />
          <v-list-tile v-for="(link, i) in links" :key="i" :to="link.to" active-class="rgba(27, 27, 27, 0.74)" avatar class="v-list-item">
            <v-list-tile-action>
              <v-icon medium>{{ link.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-title v-text="link.text" />
          </v-list-tile>
        </v-layout>
      </v-img>
    </v-navigation-drawer>
    <v-toolbar fixed app flat color="gray lighten-2">
      <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid class="pa-0">
        <v-slide-y-transition mode="out-in">
          <router-view></router-view>
        </v-slide-y-transition>
      </v-container>
    </v-content>

  </v-app>
</div>
</template>

<script>
import Drawer from './components/Drawer.vue'
import Toolbar from './components/Toolbar.vue'

export default {
  name: 'jgnote',
  data: () => ({
    drawer: true,
    title: "TEST MENU",
    links: [{
        to: '/',
        icon: 'home',
        text: 'Home'
      },
      {
        to: '/test',
        icon: 'mdi-account',
        text: 'User Profile'
      },
      {
        to: '/table-list',
        icon: 'mdi-clipboard-outline',
        text: 'Table List'
      },
      {
        to: '/typography',
        icon: 'mdi-format-font',
        text: 'Typography'
      },
      {
        to: '/icons',
        icon: 'mdi-chart-bubble',
        text: 'Icons'
      },
      {
        to: '/maps',
        icon: 'mdi-map-marker',
        text: 'Maps'
      },
      {
        to: '/notifications',
        icon: 'mdi-bell',
        text: 'Notifications'
      }
    ]
  }),
  computed: {
    image() {
      return this.$store.state.image
    }
  }
}
</script>

<style>
/* CSS */
</style>
