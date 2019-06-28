
const config = {
  apiKey: "AIzaSyDUuEm5DaxnyXp_Wl2FWw2Oh0Jxghs2kLA",
    authDomain: "jgnote-firestore.firebaseapp.com",
    databaseURL: "https://jgnote-firestore.firebaseio.com",
    projectId: "jgnote-firestore",
    storageBucket: "",
    messagingSenderId: "879526790676",
    appId: "1:879526790676:web:95a76f882fe7f50b"
}

let app = firebase.initializeApp(config)

const testdb = app.firestore()

testdb.enablePersistence()
  .then(() => {
      // Initialize Cloud Firestore through firebase
      //db = app.firestore();
      console.log("here")
  })
  .catch(function(err) {
    console.log(err)
      if (err.code == 'failed-precondition') {
        console.log("오프라인으로 전환됨!!")
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code == 'unimplemented') {
        console.log("브라우저에서 지원하지 않는다아")
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });

export const db = testdb






//export const db = app.firestore()
