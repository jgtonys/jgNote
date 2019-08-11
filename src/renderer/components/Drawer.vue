<template>
<v-app>
  <v-navigation-drawer id="app-drawer" v-model="drawer" dark app fixed mobile-break-point="991" width="260">
    <v-img src="https://cdn.pixabay.com/photo/2016/01/19/17/53/writing-1149962_960_720.jpg" gradient="rgba(27, 27, 27, 0.74),rgba(27, 27, 27, 0.74)" height="100%">
      <v-layout class="fill-height" tag="v-list" column>
        <v-list-tile avatar>
          <v-list-tile-avatar color="gray lighten-3">
            <span class="white--text headline">JG</span>
          </v-list-tile-avatar>
          <v-list-tile-title>
            jgNote
          </v-list-tile-title>
        </v-list-tile>
        <v-divider class="mt-2 mb-1"/>
        <v-list-tile @click="allNoteMenu">
          <v-list-tile-action>
            <v-icon medium>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>All Notes</v-list-tile-title>
        </v-list-tile>
        <v-list class="scrollable_menu">
          <v-list-tile v-for="(menu,key) in noteMenu" @click="clickMenu(menu)" :key="menu.id" active-class="rgba(27, 27, 27, 0.74)" avatar class="v-list-item" @mouseover="listHover = key" @mouseleave="listHover = -1">
            <v-list-tile-action>
              <v-icon medium>{{ menu.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-title v-text="menu.text" />
            <v-icon v-if="listHover === key" medium @click.stop="deleteList(menu)">close</v-icon>
          </v-list-tile>
        </v-list>
        <v-btn flat @click="makeNewListDialog">Add Menu</v-btn>
      </v-layout>
    </v-img>
  </v-navigation-drawer>
  <v-content>
    <v-container fluid class="pa-0 gray-color" style="height: 100%;">
      <v-slide-y-transition mode="out-in">
        <router-view :drawer="() => {drawer = !drawer}" :listFlag="listFlagValue"></router-view>
      </v-slide-y-transition>
    </v-container>
  </v-content>

  <v-dialog v-model="makeListDialog" max-width="300" persistent>
    <v-card>
      <div class="pa-3">
        <v-layout row wrap>
          <v-flex sm2>
        <v-select v-model="selectedMenuIcon" :items="icon_list">
          <template v-slot:selection="{ item }">
            <v-icon>{{ item }}</v-icon>
          </template>
          <template v-slot:item="{ item }">
            <v-icon>{{ item }}</v-icon>
          </template>
        </v-select>
      </v-flex>
      <v-flex sm10>
        <v-text-field class="ml-2" v-model="newListTitle" :counter="20" placeholder="NEW LIST" required></v-text-field>
      </v-flex>
    </v-layout>
        <v-card-actions>

          <v-spacer></v-spacer>
          <v-btn flat="flat" @click="makeListDialog = false">
            Cancel
          </v-btn>
          <v-btn :loading="makeListLoading" :disabled="makeListLoading" flat="flat" @click="makeNewList">
            Confirm
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</v-app>
</template>

<script>
import {
  db
} from '../config/db';

export default {
  data: () => ({
    drawer: false,
    listHover: false,
    makeListDialog: false,
    makeListLoading: false,
    selectedMenuIcon: 'bookmark',
    icon_list: ['bookmark', 'code', 'favorite', 'perm_contact_calendar', 'work'],
    newListTitle: "",
    listFlagValue: {
      id: 0,
      icon: "",
      text: ""
    }
  }),
  firestore() {
    return {
      noteMenu: db.collection('menu').orderBy("createdAt"),
    }
  },
  methods: {
    allNoteMenu() {
      this.listFlagValue = {
        id: 0,
        icon: "",
        text: ""
      }
      this.drawer = !this.drawer

    },
    clickMenu(menuObj) {
      this.listFlagValue = menuObj
      this.drawer = !this.drawer
    },
    makeNewListDialog() {
      //this.drawer = !this.drawer
      this.makeListDialog = !this.makeListDialog
    },
    makeNewList() {
      this.makeListLoading = true
      let postData = {
        icon: this.selectedMenuIcon,
        text: this.newListTitle,
        createdAt: this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      };

      db.collection("menu").add(postData)
        .then((docRef) => {
          this.makeListLoading = false
          console.log("Document written with ID: ", docRef.id);
          this.makeListDialog = false
          //this.drawer = !this.drawer
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    },
    deleteList(menuObj) {
      let deleteFlag = confirm('Delete ' + menuObj.text + "List ?")
      if (deleteFlag) {
        this.drawer = !this.drawer
        this.listFlagValue = {
          id: 0,
          icon: "",
          text: ""
        }

        db.collection('notes').where('menuId', '==', menuObj.id).get()
          .then((querySnapshot) => {
            // Once we get the results, begin a batch
            var batch = db.batch();
            querySnapshot.forEach((doc) => {
              // For each doc, add a delete operation to the batch
              console.log("deleted sub doc " + doc.id)
              batch.delete(doc.ref);
            });
            // Commit the batch
            return batch.commit();
          }).then(() => {
            // Delete completed!
            db.collection("menu").doc(menuObj.id).delete().then(() => {
              console.log("Menu Document successfully deleted!");
            }).catch((error) => {
              console.error("Error removing document: ", error);
            });
          });
      }
    }
  },
  computed: {
    image() {
      return this.$store.state.image
    }
  }
}
</script>

<style>
/* CSS */
.gray-color {
  background: #f1f1f1;

}

.scrollable_menu {
  height: 80%;
  overflow: hidden;
}

.scrollable_menu:hover {
  height: 80%;
  overflow-y: scroll;
}



* {
  font-family: "NanumSquareRoundR"
}
</style>
