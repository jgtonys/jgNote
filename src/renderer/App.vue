<template>
<div id="app">
  <drawer />
</div>
</template>

<script>
import Drawer from './components/Drawer.vue';
const inputMenu = require('electron-input-menu');
const context = require('electron-contextmenu-middleware');

inputMenu.registerShortcuts();
context.use(inputMenu);

context.activate();


export default {
  components: {
    'drawer': Drawer
  },
  data: () => ({
  }),
  methods: {
  }
}


</script>

<style>

::-webkit-scrollbar {
    display: none;
}
/* CSS */
</style>
