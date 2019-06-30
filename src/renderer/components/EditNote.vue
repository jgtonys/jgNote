<template>
<div class="pa-5">
  <v-text-field label="제목" class="pl-2 pr-2" v-model="title_text"></v-text-field>
  <v-textarea outline name="input-7-4" value="내용" v-model="content_text"></v-textarea>
  <v-btn flat @click="$router.go(-1)">취소</v-btn>
  <v-btn flat @click="addNewNote">확인</v-btn>
</div>
</template>

<script>
import {
  db
} from '../config/db';
export default {
  data() {
    return {
      title_text: "",
      content_text: "",
      right: null,
      noteList: [],
    }
  },
  firestore() {
    return {
      noteList: db.collection('notes').orderBy('createdAt', "desc")
    }
  },
  methods: {
    addNewNote() {
      let postData = {
        //id: this.noteList.length,
        title_text: this.title_text,
        content_text: this.content_text,
        createdAt: this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      };

      db.collection("notes").add(postData)
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });

      this.title_text = '';
      this.content_text = '';
      this.$router.push('/')
    },
    open(link) {
      this.$electron.shell.openExternal(link)
    }
  }
}
</script>

<style>

</style>
