import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyB66raVMkuOqV6LEaaxnrCLS1VPEMPiQu4",
  authDomain: "android-web-jgnote.firebaseapp.com",
  databaseURL: "https://android-web-jgnote.firebaseio.com",
  projectId: "android-web-jgnote",
  storageBucket: "",
  messagingSenderId: "698909527282",
}


let app = firebase.initializeApp(config)

export const db = app.database()
