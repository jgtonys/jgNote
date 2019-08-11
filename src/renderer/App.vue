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
@font-face {
 font-family: 'NanumSquareRoundR';
 src: url(assets/font/NanumSquareRoundR.eot);
 src: url(assets/font/NanumSquareRoundR.woff) format('woff'),
      url(assets/font/NanumSquareRoundR.woff2) format('woff2'),
      url(assets/font/NanumSquareRoundR.ttf) format('truetype');
}

::-webkit-scrollbar {
    display: none;
}
/* CSS */
</style>
