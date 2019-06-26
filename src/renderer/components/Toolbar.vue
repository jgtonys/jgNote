<template>
  <v-toolbar>
    <v-toolbar-side-icon @click="test" app></v-toolbar-side-icon>
    <v-toolbar-title>jgNote</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat>Link One</v-btn>
      <v-btn flat>Link Two</v-btn>
      <v-btn flat>Link Three</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import {
  mapMutations,
  mapState
} from 'vuex'

  export default {
    data () {
      return {
        right: null
      }
    },
    methods: {
      test() {
        console.log(this.$store.getDrawerValue)
        this.$store.dispatch('drawerToggle')
      },
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>

</style>
