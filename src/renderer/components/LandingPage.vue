<template>
<div id="app">
  <v-card class="full-height gray-color" flat>
    <v-toolbar color="#f1f1f1" flat>
      <v-btn icon @click="">
        <v-icon @click.native.stop="drawer">menu</v-icon>
      </v-btn>
      <v-toolbar-title v-if="listFlag.id == 0">
        <v-icon medium>{{ listFlag.icon }}</v-icon>ALL NOTES
      </v-toolbar-title>
      <v-toolbar-title v-else>{{ this.listFlag.text }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="newNote()" v-if="listFlag.id != 0">
        <v-icon>add</v-icon>
      </v-btn>
    </v-toolbar>
    <div v-if="noteList.length==0">
      <div class="blog-card ma-3 alt red animated fadeIn" @click="newNote()">
        <div class="meta">
          <div class="photo"></div>
          <ul class="details">
          </ul>
        </div>
        <div class="description pa-4">
          <div class="hidden-wrapper">
            <h1 class="pb-2">
              There is No Note Available!
            </h1>
            <h2>create new note</h2>
            <p>CLICK TO CREATE NEW NOTE</p>
            <p class="read-more">
              <!--<a href="#">Read More</a>-->
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="list-card-contents">
      <div v-for="(note,key) in noteList">
        <div class="blog-card ma-3 alt animated fadeIn" @click="noteDetail(note)" :key="note.id">
          <div class="meta">
            <div class="photo" :style="{ backgroundImage: `url('${note.bgImage}')` }"></div>
            <ul class="details">
              <li class="edit"><a @click.stop="editNote(note)">Edit</a></li>
              <li class="delete"><a @click.stop="remove(note)">Delete</a></li>
            </ul>
          </div>
          <div class="description pa-4">
            <div class="hidden-wrapper">
              <h1 class="pb-2">
                <v-icon medium v-if="note.todo" @click.stop="toggleChecked(note)">
                  {{ computedCheck(note.completed) }}
                </v-icon>
                {{ note.title_text }}
              </h1>
              <h2>{{ computedDiffDate(note.createdAt,"") }}</h2>
              <p>{{ note.subtitle}}</p>
              <p class="read-more">
                 {{ computedDiffDate(note.updatedAt,"modified ") }}
                <!--<a href="#">Read More</a>-->
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-card>

</div>
</template>

<script>
import {
  db
} from '../config/db';


export default {
  props: {
    listFlag: {
      type: Object,
      required: true
    },
    drawer: {
      type: Function
    },
  },
  name: 'App',
  components: {
  },
  firestore() {
    return {
      allList: db.collection('notes').orderBy("createdAt", "desc"),
      noteMenu: db.collection('menu').orderBy("createdAt"),
    }
  },
  data() {
    return {
      enabled: true,
      revealed: {},
      lastEventDescription: '',
      noteMenu: [],
      allList: [],
      selectedNote: "",
      flag: true,
      tid: 'FX46Drx90NHm4BVu33Dr'
    };
  },
  mounted() {
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
      this.$store.dispatch('setSelectedNote', {
        payload: item
      })
      this.$router.push('/noteView')
    },
    editNote(item) {
      let menuId = this.tid
      this.$store.dispatch('menuIdSet', {
        payload: menuId
      })
      this.$store.dispatch('setSelectedNote', {
        payload: item
      })
      this.$router.push('/editNote')
    },
    newNote() {
      let menuId = this.tid
      this.$store.dispatch('menuIdSet', {
        payload: menuId
      })
      this.$router.push('/newNote')
    },
    toggleChecked(item) {
      db.collection("notes").doc(item.id).update({completed: !item.completed}).then(() => {
        console.log("updated " + item.id)
      })
    },
    remove(item) {
      let deleteFlag = confirm('Delete ' + item.title_text + "Note ?")
      if (deleteFlag) {
        db.collection("notes").doc(item.id).delete().then(function() {
          console.log("Document successfully deleted!");
        }).catch(function(error) {
          console.error("Error removing document: ", error);
        });
      }
    },
    computedCheck(flag) {
      if(flag) return "check_box"
      else return "check_box_outline_blank"
    },
    computedDiffDate(d,pre) {
      if(!d) return ""
      let now = this.$moment(new Date());
      if(now.diff(d,'seconds') <= 60) return pre + now.diff(d,'seconds') + " seconds ago"
      else if(now.diff(d,'minutes') <= 60) return pre + now.diff(d,'minutes') + " minutes ago";
      else if(now.diff(d,'hours') <= 24) return pre + now.diff(d,'hours') + " hours ago";
      else if(now.diff(d,'days') <= 7) return pre + now.diff(d,'days') + "days ago";
      else return d.format('YYYY-MM-DD');
    },
    exportAsFile() {
      const data = this.selectedNote.content_text
      const blob = new Blob([data], {
        type: 'text/plain'
      })
      const e = document.createEvent('MouseEvents'),
        a = document.createElement('a');
      a.download = this.selectedNote.title_text + ".md";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
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
  computed: {
    noteList() {
      if (this.listFlag.id == 0) {
        return this.allList
      } else {
        this.tid = this.listFlag.id
        return this.allList.filter(i => i.menuId == this.listFlag.id)
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../assets/listStyle.scss";

.gray-color {
    background: #f1f1f1;
}
</style>
