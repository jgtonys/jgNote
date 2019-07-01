<template>
<div @keydown.meta.83.capture.stop="tmpSave" @keydown.esc.capture.stop="closeNote">
  <v-card>
    <v-container fluid class="bg-opacity">
      <div class="bg" :style="{ backgroundImage: `url('${backgroundUrl}')` }"></div>
      <div style="height: 200px">
        <v-layout align-start>
          <v-btn icon>
            <v-icon @click="closeNote">close</v-icon>
          </v-btn>

          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon @click="checkIcon = !checkIcon" v-if="checkIcon">check_box</v-icon>
            <v-icon @click="checkIcon = !checkIcon" v-else="checkIcon">check_box_outline_blank</v-icon>
          </v-btn>

          <v-btn icon>
            <v-icon @click="addThumbnail">add_photo_alternate</v-icon>
          </v-btn>
          <v-btn icon :loading="newNoteLoading" :disabled="newNoteLoading">
            <v-icon @click="addNewNote">done</v-icon>
          </v-btn>
        </v-layout>
        <v-layout>
          <input type="text" class="title-text" v-model="title_text" autofocus placeholder="Title" />
        </v-layout>
        <v-layout class="mt-3">
          <textarea rows="3" class="subtitle" v-model="subtitle" placeholder="Sub-Title" />
          </v-layout>
</div>
  </v-container>
  <editor  :options="editorOptions" :html="editorHtml" :visible="editorVisible" previewStyle="tab" height="500px" mode="markdown" v-model="content_text" />
</v-card>

<v-dialog v-model="addImageDialog" hide-overlay>
  <v-card>

    <v-toolbar color="white" flat>
      <v-btn icon @click="addImageDialog = false">
        <v-icon>close</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon @click="saveBgimg">
        <v-icon>done</v-icon>
      </v-btn>
    </v-toolbar>
      <div class="helper"></div>
    	<div class="drop display-inline align-center" @dragover.prevent @drop="onDrop">
        <div class="helper"></div>
        <label v-if="!image" class="btn display-inline">
    	        SELECT OR DROP AN IMAGE
    	        <input type="file" name="image" @change="onChange">
        </label>
        <div class="hidden display-inline align-center" v-else v-bind:class="{ 'image': true }">
          <img :src="image" alt="" class="img" />
          <br>
          <br>
          <button class="btn" @click="removeFile">REMOVE</button>
        </div>
      </div>
  </v-card>
</v-dialog>

<v-snackbar
      v-model="notification"
      :timeout="noti.timeout"
      :right="noti.right"
      :top="noti.top"
    >
      Successfully Saved
    </v-snackbar>

</div>
</template>

<script>
import {
  mapGetters,
  mapState
} from 'vuex';
import 'tui-editor/dist/tui-editor.css';
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
      id: "",
      newFlag: true,
      title_text: "",
      subtitle: "",
      content_text: "",
      noteList: [],
      image: '',
      file: '',
      checkIcon: false,
      dueDate: "",
      dataMenu: false,
      addImageDialog: false,
      newNoteLoading: false,
      noti: {
        timeout: 1500,
        right: true,
        top: true
      },
      notification: false,
      backgroundUrl: '',
      editorOptions: {
        hideModeSwitch: false,
        usageStatistics: false,
        hooks: {
          'addImageBlobHook': (blob, callback) => {
            var loading = "..uploading image.."
            this.content_text += loading; // show uploading
            //var uploadedImageURL = that.imageUpload(blob);
            this.uploadFileAsync(blob, loading.length).then(res => {
              console.log(res);
              callback(res);
            })
            return false;
            //run callback
            //callback('Image URL');
          }
        },
      },
      uploadEditorOptions: {
        hideModeSwitch: false,
        usageStatistics: false,
        hooks: {
          'addImageBlobHook': (blob, callback) => {
            //var uploadedImageURL = that.imageUpload(blob);
            this.uploadFileAsync(blob).then(res => {
              this.backgroundUrl = res;
              console.log(this.backgroundUrl);
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
    async uploadFileAsync(blob, loadingLen) {
      let base64 = await this.readFileAsync(blob);
      // for github api V3 authentication header setting (axios)
      // axios instance must be created
      let uploadAxios = this.$http.create({
        timeout: 5000,
        headers: {
          'Authorization': 'token 6c7974bdf899016274cb28909be5d3f60fee6577',
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
        .then(res => {
          this.content_text = this.content_text.slice(0, this.content_text.length - loadingLen);
          return res.data.content.html_url + '?raw=true'
        })
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
      })

      let issue_parm = {
        "title": "image test",
        "body": "asfwe.",
        "assignees": []
      }

      uploadAxios.post('https://api.github.com/repos/jgtonys/upload_test/issues',issue_parm).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err)
      })

      */
    },
    saveBgimg() {
      if (this.image == "") {
        alert("Image Not Selected!")
      } else {
        this.uploadFileAsync(this.file).then(res => {
          this.backgroundUrl = res;
          this.file = "";
          this.image = "";
          this.addImageDialog = !this.addImageDialog;
        })
      }

    },
    tmpSave() {
      if (this.newFlag) { // 새로운 노트이면 임시저장을 게시글 추가하는 방법으로 작성한다
        this.newNoteLoading = true
        this.$store.dispatch('getMenuId').then(menuId => {
          if (!menuId) alert("Saving Note Failed : Invalid Menu!")
          else {
            let postData = {
              title_text: this.title_text,
              subtitle: this.subtitle,
              todo: this.checkIcon,
              completed: false,
              bgImage: this.backgroundUrl,
              content_text: this.content_text,
              menuId: menuId,
              createdAt: this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
              updatedAt: "",
            };

            db.collection("notes/").add(postData)
              .then((docRef) => {
                this.newNoteLoading = false;
                this.id = docRef.id;
                this.newFlag = false;
                console.log("Saved with ID: ", docRef.id);
                this.notification = true;
              })
              .catch((error) => {
                console.error("Error saving document: ", error);
              });
          }
        })
      }
      else { // 이미 임시저장이 되어있다면 update 한다
        if(this.id =="") {
          console.log("Note must be saved before temporary save!");
          return 0;
        }
        this.newNoteLoading = true;
        let postData = {
          title_text: this.title_text,
          subtitle: this.subtitle,
          todo: this.checkIcon,
          bgImage: this.backgroundUrl,
          content_text: this.content_text,
          updatedAt: this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        };
        db.collection("notes").doc(this.id).update(postData).then(() => {
          console.log("updated " + this.id)
          this.newNoteLoading = false;
          this.notification = true;
        });
      }
    },
    addNewNote() {
      if (this.newFlag) {
        this.newNoteLoading = true
        this.$store.dispatch('getMenuId').then(menuId => {
          if (!menuId) alert("Adding Note Failed : Invalid Menu!")
          else {
            let postData = {
              title_text: this.title_text,
              subtitle: this.subtitle,
              todo: this.checkIcon,
              completed: false,
              bgImage: this.backgroundUrl,
              content_text: this.content_text,
              menuId: menuId,
              createdAt: this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            };

            db.collection("notes/").add(postData)
              .then((docRef) => {
                this.newNoteLoading = false
                console.log("Document written with ID: ", docRef.id);
                this.title_text = '';
                this.subtitle = '';
                this.content_text = '';
                this.$router.push('/');
              })
              .catch((error) => {
                console.error("Error adding document: ", error);
              });
          }
        })
      }
      else {
        if(this.id =="") {
          console.log("Note must be saved before temporary save!");
          return 0;
        }
        this.newNoteLoading = true;
        let postData = {
          title_text: this.title_text,
          subtitle: this.subtitle,
          todo: this.checkIcon,
          bgImage: this.backgroundUrl,
          content_text: this.content_text,
          updatedAt: this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        };
        db.collection("notes").doc(this.id).update(postData).then(() => {
          console.log("updated " + this.id)
          this.newNoteLoading = false;
          this.title_text = '';
          this.subtitle = '';
          this.content_text = '';
          this.$router.push('/');
        });
      }
    },
    closeNote() {
      let closeFlag = confirm('Close current Note?')
      if (closeFlag) {
        this.$router.push('/')
      }
    },
    addThumbnail() {
      this.addImageDialog = !this.addImageDialog;
    },
    open(link) {
      this.$electron.shell.openExternal(link)
    },
    onDrop: function(e) {
      e.stopPropagation();
      e.preventDefault();
      var files = e.dataTransfer.files;
      this.createFile(files[0]);
    },
    onChange(e) {
      var files = e.target.files;
      this.createFile(files[0]);
    },
    createFile(file) {
      console.log(file)
      if (!file.type.match('image.*')) {
        alert('Select an image');
        return;
      }
      var img = new Image();
      var reader = new FileReader();
      var vm = this;

      reader.onload = function(e) {
        vm.image = e.target.result;
      }
      reader.readAsDataURL(file);
      this.file = file;
    },
    removeFile() {
      this.image = '';
    }
  },
  beforeMount() {

    this.$http.get('https://source.unsplash.com/random/800x600').then(r => {
      this.backgroundUrl = r.request.responseURL;
      console.log("random background image set")
    });
  },
  computed: {
    ...mapState({
      menuId: state => state.menuId
    }),
    backgroundSet() {
      console.log("chagned!" + this.backgroundUrl)
      let overlay = 'linear-gradient(270deg, rgba(0, 0, 0, .5), rgba(0, 0, 0, .5))';
      return 'background-image:' + ' , url(' + this.backgroundUrl + ');';
    }
  },
}

/*
var down = [];
$(document).keydown(function(e) {
    down[e.keyCode] = true;
}).keyup(function(e) {
    if (down[91] && down[83]) {
        alert('oh hai');
    }
    down[e.keyCode] = false;
});*/
</script>

<style>
@import "../assets/tui-editor-contents.css";

code {
  box-shadow: none;
}

/*
.te-toolbar-section {
  display: none;
}
*/
.te-mode-switch-section {
  display: none !important;
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
  font-size: 20px;
  resize: none;
}

code:before,
code:after {
  content: none;
}

.btn {
  background-color: #d3394c;
  border: 0;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-weight: bold;
  padding: 15px 35px;
  position: relative;
}

.btn:hover {
  background-color: #722040;
}

input[type="file"] {
  position: absolute;
  opacity: 0;
  z-index: -1;
}

.align-center {
  text-align: center;
}

.helper {
  height: 100%;
  width: 100%;
  display: inline-block;
  vertical-align: middle;
  width: 0;
}

.hidden {
  display: none !important;
}

.hidden.image {
  display: inline-block !important;
}

.display-inline {
  display: inline-block;
  vertical-align: middle;
}

.img {
  border: 1px solid #f6f6f6;
  display: inline-block;
  height: auto;
  max-height: 80%;
  max-width: 80%;
  width: auto;
}

.drop {
  background-color: #f2f2f2;
  border: 4px dashed #ccc;
  background-color: #f6f6f6;
  border-radius: 2px;
  height: 100%;
  max-height: 100%;
  max-width: 100%;
  width: 100%;
}
</style>
