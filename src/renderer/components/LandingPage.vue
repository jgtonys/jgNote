<template>
<div id="app">
  <!--<v-toolbar-side-icon @click.native.stop="drawer = !drawer" ></v-toolbar-side-icon>-->
  <v-tabs color="transparent" show-arrows>
    <v-tabs-slider color="black" fixed></v-tabs-slider>

    <v-tab v-for="(i,key) in noteMenu" :key="key" :href="'#tab-' + key">
      <v-icon medium>{{ i.icon }}</v-icon>
      {{ i.text }}
    </v-tab>


    <v-tabs-items>
      <v-tab-item v-for="(i,key) in noteMenu" :key="key" :value="'tab-' + key">
        <v-card flat>
          {{ i }}
          <swipe-list ref="list" class="card" :disabled="!enabled" :items="noteList" :key="key" :revealed.sync="revealed" @leftRevealed="setLastEvent('leftRevealed', $event)" @rightRevealed="setLastEvent('rightRevealed', $event)"
            @swipeout:click="itemClick">
            <template v-slot="{ item, index, revealLeft, revealRight, close, revealed }">
              <transition-group name="list-complete" tag="p">
                <div ref="content" class="card-content noselect list-complete-item" @click="noteDetail(item)" :key="item.title_text">
                  <viewer :value="item.title_text" height="50px" />
                  <p>{{ item.createdAt }}</p>
                </div>
              </transition-group>
            </template>

            <template v-slot:left="{ item, close, index }">
              <div class="swipeout-action red" title="remove" @click="remove(item)">
                <i class="fa fa-trash"></i>
              </div>
            </template>

            <template v-slot:right="{ item }">
              <div class="swipeout-action blue">
                <i class="fa fa-heart"></i>
              </div>
            </template>
            <template v-slot:empty>
              <div>
                list is empty ( filtered or just empty )
              </div>
            </template>
          </swipe-list>

          <v-fab-transition>
            <v-btn color="pink" dark fixed bottom right fab @click="newNote(i.id)">
              <v-icon>add</v-icon>
            </v-btn>
          </v-fab-transition>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>





  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="black">
        <v-btn icon dark @click="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ selectedNote.createdAt }}에 적힌 노트</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark flat @click="dialog = false">Save</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-divider></v-divider>
      <div class="pa-5">
        <viewer :value="selectedNote.content_text" height="500px" />
      </div>

    </v-card>
  </v-dialog>



</div>
</template>

<script>
import 'tui-editor/dist/tui-editor-contents.css';
import {
  Viewer
} from '@toast-ui/vue-editor'
import {
  SwipeList,
  SwipeOut
} from 'vue-swipe-actions';
import {
  db
} from '../config/db';
// eslint-disable-next-line no-unused-vars
export default {
  name: 'App',
  components: {
    SwipeOut,
    SwipeList,
    'viewer': Viewer
  },
  firestore() {
    return {
      noteList: db.collection('notes').orderBy('createdAt', "desc"),
      noteMenu: db.collection('menu').orderBy("createdAt")
    }
  },
  data() {
    return {
      enabled: true,
      page: 0,
      revealed: {},
      noteList: [],
      lastEventDescription: '',
      ids: 0,
      mockSwipeList: [],
      noteMenu: [],
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      selectedNote: "test"
    };
  },
  mounted() {
    //this.refreshList()
    // ideally should be in some global handler/store
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  },
  methods: {
    noteDetail(item) {
      this.selectedNote = item
      this.dialog = true
    },
    newNote(menuId) {
      this.$store.dispatch('menuIdSet',{
        payload: menuId
      })
      this.$router.push('/newNote')
    },
    drawerToggle() {
      this.$store.dispatch('drawerToggle')
    },
    remove(item) {
      console.log(item)
      console.log(item.id)
      db.collection("notes").doc(item.id).delete().then(function() {
        console.log("Document successfully deleted!");
      }).catch(function(error) {
        console.error("Error removing document: ", error);
      });
      //this.mockSwipeList = this.mockSwipeList.filter(i => i !== item);

    },
    setLastEvent(name, {
      item,
      index
    }) {
      this.lastEventDescription = {
        name,
        index,
        id: item.id,
      };
    },
    itemClick(e) {
      console.log(e, 'item click');
    },
    fbClick(e) {
      console.log(e, 'First Button Click');
    },
    sbClick(e) {
      console.log(e, 'Second Button Click');
    },
    // keyboard
    onKeyDown(e) {
      if (e.keyCode !== 16) return;
      this.enabled = false;
    },
    onKeyUp(e) {
      if (e.keyCode !== 16) return;
      this.enabled = true;
    },
  },
};
</script>
<style>
.list-complete-item {
  transition: all 0.3s;
  display: inline-block;
  margin-right: 10px;
}

.list-complete-enter,
.list-complete-leave-to

/* .list-complete-leave-active below version 2.1.8 */
  {
  opacity: 0;
  transform: translateY(30px);
}

.list-complete-leave-active {
  position: absolute;
}

.noselect {
  -webkit-touch-callout: none;
  /* iOS Safari */
  -webkit-user-select: none;
  /* Safari */
  -khtml-user-select: none;
  /* Konqueror HTML */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* Internet Explorer/Edge */
  user-select: none;
  /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}

/* app specific styles */
.swipeout-action {
  display: flex;
  align-items: center;
  padding: 0 3rem;
  cursor: pointer;
  left: 0;
}

/* https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/color/ */
.swipeout-action.blue {
  color: white;
  background-color: rgb(0, 122, 255);
}

.swipeout-action.blue:hover {
  background-color: darken(rgb(0, 122, 255), 5%);
}

.swipeout-action.purple {
  color: white;
  background-color: rgb(88, 86, 214);
}

.swipeout-action.purple:hover {
  background-color: darken(rgb(88, 86, 214), 5%);
}

.swipeout-action.red {
  color: white;
  background-color: rgb(255, 59, 48);
}

.swipeout-action.red:hover {
  background-color: darken(rgb(255, 59, 48), 5%);
}

.swipeout-action.green {
  color: white;
  background-color: rgb(76, 217, 100);
}

.swipeout-action.green:hover {
  background-color: darken(rgb(76, 217, 100), 5%);
}

.swipeout-list-item {
  flex: 1;
  border-bottom: 1px solid lightgray;
}

.swipeout-list-item:last-of-type {
  border-bottom: none;
}

.card {
  width: 100%;
  background-color: white;
  border-radius: 3px;
  box-shadow: none;
  border: 1px solid lightgray;
}

.card-content {
  padding: 1rem;
}

.transition-right {
  transform: translate3d(100%, 0, 0) !important;
}

.transition-left {
  transform: translate3d(-100%, 0, 0) !important;
}

.toolbar {
  display: flex;
  align-items: center;
}

.toolbar .toolbar-section {
  flex: 0 0 auto;
}

.toolbar .toolbar-section--center {
  flex: 1000 1 0%;
}

.swipeout {
  position: relative;
  overflow: hidden;
  display: flex;
}

.swipeout .swipeout-left,
.swipeout .swipeout-right {
  position: absolute;
  height: 100%;
  display: flex;
  z-index: 1;
}

.swipeout .swipeout-left {
  left: 0;
  transform: translateX(-100%);
}

.swipeout .swipeout-right {
  right: 0;
  transform: translateX(100%);
}

.swipeout .swipeout-content,
.swipeout .swipeout-action {
  transition: transform .2s;
  will-change: transform;
}

.swipeout.swipeout--no-transition .swipeout-content,
.swipeout.swipeout--no-transition .swipeout-action {
  transition: none !important;
}

.swipeout .swipeout-content {
  width: 100%;
}

.swipeout-non-selectable {
  user-select: none !important;
}

.swipeout-no-pointer-events {
  pointer-events: none !important;
}

/* SwipeList */

.swipeout-list {
  display: flex;
  flex-direction: column;
}

.swipeout-list-item {
  flex: 1;
}
</style>
