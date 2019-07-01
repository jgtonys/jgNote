<template>
<div class="pa-5">
  <!--<v-text-field label="제목" class="pl-2 pr-2" v-model="title_text"></v-text-field>-->
  <!--<v-textarea outline name="input-7-4" value="내용" v-model="content_text"></v-textarea>-->
  <editor :options="editorOptions" :html="editorHtml" :visible="editorVisible" previewStyle="tab" height="500px" mode="markdown" v-model="content_text" />
  <v-fab-transition>
    <v-btn color="pink" dark fixed top right fab @click="$router.go(-1)">
      <v-icon>cancel</v-icon>
    </v-btn>
  </v-fab-transition>
  <v-fab-transition>
    <v-btn color="pink" dark fixed bottom right fab @click="addNewNote">
      <v-icon>check</v-icon>
    </v-btn>
  </v-fab-transition>
</div>
</template>

<script>
import {
  mapGetters,
  mapState
} from 'vuex';
import 'tui-editor/dist/tui-editor.css';
import 'tui-editor/dist/tui-editor-contents.css';
import 'codemirror/lib/codemirror.css';
import 'highlight.js/styles/github.css';
import {
  Editor
} from '@toast-ui/vue-editor'
import {
  db
} from '../config/db';
export default {
  components: {
    'editor': Editor
  },
  data() {
    return {
      title_text: "",
      content_text: "",
      right: null,
      noteList: [],
      editorText: 'This is initialValue.',
      editorOptions: {
        hideModeSwitch: false,
        usageStatistics: false,
      },
      editorHtml: '',
      editorVisible: true,
    }
  },
  methods: {
    addNewNote() {
      this.title_text = this.content_text.split('\n')[0]
      var postData
      this.$store.dispatch('getMenuId').then(menuId => {
        postData = {
          title_text: this.title_text,
          content_text: this.content_text,
          menuId: menuId,
          createdAt: this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        };

        db.collection("notes/").add(postData)
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });

        this.title_text = '';
        this.content_text = '';
        this.$router.push('/');
      })

      /*this.$store.dispatch('getMenuId').then(menuId => {
        console.log("메뉴아이디 : " + menuId)
        db.collection("menu/"+menuId+"/notes/").add(postData)
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });

        this.title_text = '';
        this.content_text = '';
        this.$router.push('/')

      })*/

      /*db.collection("notes/").add(postData)
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });

      this.title_text = '';
      this.content_text = '';
      this.$router.push('/')*/
    },

    open(link) {
      this.$electron.shell.openExternal(link)
    }
  },
  computed: {
    ...mapState({
      menuId: state => state.menuId
    })
  }
}
</script>

<style>
code {
  box-shadow: none;
}

code:before,
code:after {
  content: none;
}
</style>
