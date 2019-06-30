

<template>
  <v-tabs
  color="transparent"
  show-arrows
  >
  <v-tabs-slider color="black" fixed></v-tabs-slider>

  <v-tab
  v-for="i in 30"
  :key="i"
  :href="'#tab-' + i"
  >
  Item {{ i }}
  </v-tab>
  </v-tabs>
</template>

<script>
import {
  db
} from '../config/db';
export default {
  data() {
    return {

    }
  },
  /*
  firestore() {
    return {
      //noteList: db.collection('notes').orderBy('createdAt', "desc")
    }
  },*/
  methods: {
    addNewNote() {
    },
    open(link) {
      this.$electron.shell.openExternal(link)
    }
  }
}
</script>

<style>
</style>
