const fs = window.require('fs');
const path = window.require('path');
const remote = require('electron').remote;
const appPath = remote.app.getAppPath();

let data = "";

if (process.env.NODE_ENV !== 'development') {
  if (process.platform === "darwin") data = fs.readFileSync(path.join(appPath,'../../../firebase.json'));
  else data = fs.readFileSync(path.join(appPath,'../../firebase.json'));
}
else {
  data = fs.readFileSync(path.join(__static,'../devSettingFiles/firebase.json'))
}


const json = data.toString('utf8');
let settings = JSON.parse(json);

let app = firebase.initializeApp(settings)

const testdb = app.firestore()

testdb.enablePersistence()
  .then(() => {
      // Initialize Cloud Firestore through firebase
      //db = app.firestore();
      console.log("온라인으로 전환됨")
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
