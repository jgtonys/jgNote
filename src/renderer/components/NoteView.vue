<template>
<div @keydown.esc.capture="closeNote" class="full-height">
  <v-card class="full-height">
    <v-container fluid class="bg-opacity">
      <div class="bg" :style="{ backgroundImage: `url('${bgImage}')` }"></div>
      <div style="height: 200px">
        <v-layout align-start>
          <v-btn icon>
            <v-icon @click="closeNote">close</v-icon>
          </v-btn>

          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon @click="editNote">edit</v-icon>
          </v-btn>
          <!-- Save as pdf (screen capture from backend)  - modified 170721 - -->
          <v-speed-dial v-model="saveFab" direction="bottom" transition="slide-y-reverse-transition">
            <template v-slot:activator>
              <v-btn v-model="saveFab" icon>
                <v-icon>present_to_all</v-icon>
              </v-btn>
            </template>
            <v-btn icon dark color="blue-grey darken-1">
              <v-icon @click="exportAsPdf">crop_original</v-icon>
            </v-btn>
            <v-btn icon dark color="blue-grey darken-1">
              <v-icon @click="exportAsFile">subject</v-icon>
            </v-btn>
          </v-speed-dial>

          <v-btn icon>
            <v-icon @click="remove">delete</v-icon>
          </v-btn>
        </v-layout>
        <v-layout>
          <h1 class="title-text">{{ title_text }}</h1>
        </v-layout>
        <v-layout class="mt-3">
          <p class="subtitle">{{ subtitle }}</p>
        </v-layout>
      </div>
    </v-container>
    <div class="pa-5">
      <viewer :value="content_text" height="100%" />
    </div>
  </v-card>
</div>
</template>

<script>
import {
  remote
} from 'electron';
import {
  fs
} from 'fs';
import 'highlight.js/styles/github.css';
import {
  Viewer
} from '@toast-ui/vue-editor'
import {
  db
} from '../config/db';
import {
  mapState
} from 'vuex';
export default {
  components: {
    'viewer': Viewer
  },
  data() {
    return {
      id: "",
      title_text: "",
      bgImage: "",
      subtitle: "",
      createdAt: "",
      content_text: "",
      saveFab: false,
    }
  },
  beforeMount() {
    this.$store.dispatch('getSelectedNote').then(r => {
      this.id = r.id
      this.title_text = r.title_text
      this.bgImage = r.bgImage
      this.subtitle = r.subtitle
      this.content_text = r.content_text
      this.createdAt = r.createdAt
    })

  },
  methods: {
    /*
    //  <Export as pdf>
    //  Get electron window.webContents
    //  printToPDF, encode to 'base64'
    //  convert base64 to blob
    //  - modified 190721 -
    */
    exportAsPdf() {
      remote.getCurrentWebContents().printToPDF({
        marginsType: 2,
        printBackground: true,
        printSelectionOnly: false,
        landscape: false
      }, (error, data) => {
        if (error) throw error
        const blob = new Blob([data], {
          type: 'application/pdf'
        })
        const e = document.createEvent('MouseEvents'),
        a = document.createElement('a');
        a.download = this.title_text + ".pdf";
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['application/pdf', a.download, a.href].join(':');
        e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
      })
    },
    editNote() {
      this.$router.push('/editNote')
    },
    remove() {
      let deleteFlag = confirm('Delete ' + this.title_text + "Note ?")
      if (deleteFlag) {
        db.collection("notes").doc(this.id).delete().then(function() {
          console.log("Document successfully deleted!");
        }).catch(function(error) {
          console.error("Error removing document: ", error);
        });
      }
    },
    closeNote() {
      this.$router.push('/');
    },
    exportAsFile() {
      const data = this.content_text
      const blob = new Blob([data], {
        type: 'text/plain'
      })
      const e = document.createEvent('MouseEvents'),
      a = document.createElement('a');
      a.download = this.title_text + ".md";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },
    open(link) {
      this.$electron.shell.openExternal(link)
    }
  },
}
</script>

<style>
@import "../assets/tui-editor-contents.css";

.full-height {
  height: 100%;
}

.bg-opacity {
  position: relative;
  z-index: 1;
}

.bg-opacity .bg {
  position: absolute;
  z-index: -1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: .2;
  width: 100%;
  height: 100%;
  background-position: center center;
}

input[type=text] {
  border: none;
  background-color: none;
  outline: 0;
}

input[type=text]:focus {
  border: none;
  background-color: none;
  outline: 0;
}

.title-text {
  margin: auto;
  width: 100%;
  text-align: center;
  font-size: 25px;
}

.subtitle {
  margin: auto;
  width: 70%;
  text-align: center;
  font-size: 12px !important;
  resize: none;
  max-height: 90px;
  overflow: hidden
}
</style>
