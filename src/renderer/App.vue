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
          <v-btn @click="addMenu">목록추가</v-btn>
        </v-layout>
      </v-img>
    </v-navigation-drawer>
    <v-content>
      <v-container fluid class="pa-0">
        <v-slide-y-transition mode="out-in">
          <router-view></router-view>
        </v-slide-y-transition>
      </v-container>
    </v-content>

      <v-fab-transition v-if="!drawer">
        <v-btn color="black" dark fixed bottom left fab @click.native.stop="drawer = !drawer">
          <v-icon>menu</v-icon>
        </v-btn>
      </v-fab-transition>
  </v-app>
</div>
</template>

<script>
import Drawer from './components/Drawer.vue'
import Toolbar from './components/Toolbar.vue'
import {
  db
} from './config/db';

export default {
  name: 'jgnote',
  data: () => ({
    bottomNav: 0,
    drawer: true,
    title: "TEST MENU",
    links: [{
      to: '/',
      icon: 'home',
      text: 'HOME'
    }],
  }),
  /*
  firestore() {
    return {
      links: db.collection('menu').orderBy("createdAt")
    }
  },*/
  methods: {
    addMenu() {
      let postData = {
        to: "test",
        icon: "note",
        text: "text",
        createdAt: this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      };

      db.collection("menu").add(postData)
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    }
  },
  computed: {
    image() {
      return this.$store.state.image
    },
    color() {
      switch (this.bottomNav) {
        case 0:
          return 'blue-grey'
        case 1:
          return 'teal'
        case 2:
          return 'brown'
        case 3:
          return 'indigo'
      }
    },
    hideDrawerMenu() {
      return this.$store.state.hideDrawerMenu
    }
  }
}
</script>

<style>
/* CSS */
</style>
