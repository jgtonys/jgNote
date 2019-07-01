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
        hooks: {
          'addImageBlobHook': (blob, callback) => {
            //var uploadedImageURL = that.imageUpload(blob);
            this.uploadFileAsync(blob).then(res => {
              console.log(res);
              callback(res);
            })

            return false;
            //run callback
            //callback('Image URL');
          }
        },
      },

      editorHtml: '',
      editorVisible: true,
    }
  },
  methods: {
    // blob(image) data is converted to base64 string
    // return Promise object
    readFileAsync(blob) {
      return new Promise((resolve, reject) => {
        let reader = new window.FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          let base64data = reader.result;
          let base64 = base64data.split(',')[1];
          resolve(base64);
        }
        reader.onerror = reject;
      })
    },

    // because readFileAsnyc returns Promise object, this function is async
    async uploadFileAsync(blob) {
      let base64 = await this.readFileAsync(blob);

      // for github api V3 authentication header setting (axios)
      // axios instance must be created
      let uploadAxios = this.$http.create({
        timeout: 5000,
        headers: {
          'Authorization': 'token b656cba948d1e73bb8b94a98a67ed4551ed331b8',
          'Content-Type': 'application/json'
        }
      });

      // for github api V3 : upload content in repo
      let repo_parm = {
        "message": "image uploaded",
        "branch": "master",
        "content": base64
      }

      // content name must be distinguished : upload time append
      const uid = new Date();

      // upload content -> response is "uploaded content url"
      return uploadAxios.put('https://api.github.com/repos/jgtonys/upload_test/contents/screenshot-' + uid + ".png", repo_parm)
      .then(res => res.data.content.html_url + '?raw=true')
      .catch(err => {
        console.log(err)
      })
    },
    test(blob) {
      console.log(blob)
      var returnValue = ""

      var reader = new window.FileReader();
      reader.readAsDataURL(blob);
      return reader.onloadend = () => {
        let base64data = reader.result;
        let base64 = base64data.split(',')[1];
      }
      //return returnValue

      /*
      uploadAxios.put('https://api.github.com/repos/jgtonys/upload_test/contents/screenshot-' + uid + ".png", repo_parm).then(res => {
        console.log(res.content.html_url + '?raw=true');
      }).catch(err => {
        console.log(err)
      })*/

      let issue_parm = {
        "title": "image test",
        "body": "asfwe.",
        "assignees": []
      }

      /*
      uploadAxios.post('https://api.github.com/repos/jgtonys/upload_test/issues',issue_parm).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err)
      })

      */
      console.log("hahahah")

      //return "heheh"
    },
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
