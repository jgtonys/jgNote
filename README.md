## [Electron + Vue.js + Firebase] Cross-Platform Markdown Note Application

made by Jungyu Kim



### Main functions of application

- No Local Database [online sync, enable offline]
- Cross-Platform [Windows,Mac,Linux,(mobile)]
- Markdown [export PDF, image auto uploading to github]
- Custom keyboard shortcuts



### Preivew

![image.png](https://github.com/jgtonys/upload_test/blob/master/screenshot-Mon%20Aug%2012%202019%2015:24:12%20GMT%2B0900%20%28KST%29.png?raw=true)

![5C418357-0607-4E62-8AE5-65C71B194EE9.png](https://github.com/jgtonys/upload_test/blob/master/screenshot-Mon%20Aug%2012%202019%2015:24:29%20GMT%2B0900%20%28KST%29.png?raw=true)



## Functions

- Markdown editor (based tui-editor)
  - temporary save via command (ctrl+s)
  - quit via command (esc)
  - background image random generate (unsplash API)
  - background image upload setting (GitHub API)
  - image github uploading by dropping (Github API)
  - async request loading
  - auto firestore connect (google firestore)
  - offline sync firestore (cache setting)
  - export as Markdown, PDF
  - design (vuetify, bootstrap4, animated.css)
- Electron Application
  - tray icon setting (Windows, MacOs, Linux)
  - builder setting (webpack)
  - auto hide & remaining tray icon
  - firestore & github setting json file



*Image uploading via Github API*

```javascript
/* 
** When image is dragged on editor, addImageBlobHook will be called
** Returned callback will be shown on editor
*/
editorOptions: {
  	hideModeSwitch: false,
    usageStatistics: false,
    highlightFormatting: true,
    hooks: {
      'addImageBlobHook': (blob, callback) => {
          this.LoadingNotification = true;
          this.uploadFileAsync(blob).then(res => {
            if (!res) {
              this.LoadingNotification = false;
              this.showNotification("Error: Upload Failed by Connection", "error");
            } 
            else callback(res);
          })
          return false;
       }
    },
},
          
/* 
** Image blob file to base64
** con file contains setting information (json file)
*/
async uploadFileAsync(blob) {
    let base64 = await this.readFileAsync(blob);
    // for github api V3 authentication header setting (axios)
    // axios instance must be created
    let uploadAxios = this.$http.create({
      timeout: 10000,
      headers: {
        'Authorization': 'token ' + con.token,
        'Content-Type': 'application/json'
      }
    });
    // for github api V3 : upload content in repo
    let repo_parm = {
      "message": con.uploadMsg,
      "branch": con.branch,
      "content": base64
    }
      // content name must be distinguished : upload time append
      const uid = new Date();
    // upload content -> response is "uploaded content url"
    return uploadAxios.put(con.repoURL + 'screenshot-' + uid + ".png", repo_parm)
      .then(res => {
      this.LoadingNotification = false;
      this.showNotification("Successfully Uploaded Image!", "success");
      return res.data.content.html_url + '?raw=true'
    })
      .catch(err => {
      console.log(err)
      return false;
    })
},
```



*Save & Tempoary save (This can be called by command combination)* 

```javascript
tmpSave() {
  if (this.newFlag) {
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
          this.showNotification("Successfully Saved New Note", "");
        })
          .catch((error) => {
          console.error("Error saving document: ", error);
        });
      }
    })
  } 
  else {
    if (this.id == "") {
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
      this.showNotification("Successfully Saved Temporary Note", "");
    });
  }
},
```



*Export as File (communicate with Electron)*

```javascript
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
  
/*
//  <Export as Markdwon>
//  Get content text data
//  convert text data to blob
//  - modified 190721 -
*/
  
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
```



*Random Background Setting (unsplash API)*

```javascript
this.$http.get('https://source.unsplash.com/random/800x600').then(r => {
      this.backgroundUrl = r.request.responseURL;
      console.log("random background image set")
});
```



## Structure

- build : contains application installer, builder icon
- dist : compiled frontend files via webpack, electron
- settingFiles
  - firebase.json : user firebase setting
  - github.json : user github token setting
- src
  - js
  - main
  - renderer
    - assets : font, css, png files
    - components : all vue components
    - config : db, firebase, github setting files
    - router : routing files
    - store : vuex store files
    - App.vue
    - main.js
  - index.ejs : base ejs file
- static : static icon, json src files







## Install from Source

**install dependencies**

```bash
npm install
```

**rebuild from OS**

```bash
npm rebuild --runtime=electron --target=2.0.4
```

**build project**

```bash
npm run build
```

After build process, installer will be located in `jgNote/build/`

## Install and Custom Settings

If you don't want to build from source, you can download installer from below **Installer + json template link**.

**execute installer**

After install, jgNote will be automatically powered up but **nothing will be shown**. **This is because there is no firebase & github settings for jgNote**. Follow below instructions.

**Close Application via tray icon(IMPORTANT!!) **

![4C343A87-41B0-4C8A-9182-27711EB03D93.png](https://github.com/jgtonys/upload_test/blob/master/screenshot-Mon%20Aug%2012%202019%2017:01:51%20GMT%2B0900%20%28KST%29.png?raw=true)

*YOU NEED TO CLOSE APPLICATION VIA TRAY ICON! This application is not really closed until tray-close is clicked!*

**copy settingFiles to installed Folder**

copy `firebase.json` and `github.json` to

- mac : `/Applications/jgnote.app/`
- windows : `C:/Users/{USERNAME}/AppData/Local/Programs/jgnote/`

And write `firebase.json` by creating [firestore database](https://firebase.google.com). Also github api access token and repository must be in `github.json`.

This [Video](https://youtu.be/GZcl7ICXxlw) shows **how to set json files**

<br>

*In firebase setting, google analytics is optional. And if you do not need image uploading for markdown note, `github.json` can be empty. Only firebase.json must be set to execute jgNote correctly*

After making firebase project and register web application to firebase, then click database menu.

![image.png](https://github.com/jgtonys/upload_test/blob/master/screenshot-Mon%20Aug%2012%202019%2017:10:55%20GMT%2B0900%20%28KST%29.png?raw=true)

Click **Make Database**

![image.png](https://github.com/jgtonys/upload_test/blob/master/screenshot-Mon%20Aug%2012%202019%2017:11:32%20GMT%2B0900%20%28KST%29.png?raw=true)

Click **TEST MODE** and Next (you can set lock mode if you can modify source)

![image.png](https://github.com/jgtonys/upload_test/blob/master/screenshot-Mon%20Aug%2012%202019%2017:12:36%20GMT%2B0900%20%28KST%29.png?raw=true)

Set location and Next

![image.png](https://github.com/jgtonys/upload_test/blob/master/screenshot-Mon%20Aug%2012%202019%2017:14:49%20GMT%2B0900%20%28KST%29.png?raw=true)

Then you will see empty database like this!

![image.png](https://github.com/jgtonys/upload_test/blob/master/screenshot-Mon%20Aug%2012%202019%2017:16:25%20GMT%2B0900%20%28KST%29.png?raw=true)

**If you can see empty database, firestore setting from web is all done. `github.json` setting is shown in above video**



## Installer + json template Link

[Windows](https://drive.google.com/file/d/1Et2UXvV02zO-SvmB4x1e53wO27tDfT_m/view?usp=sharing)

[Mac](https://drive.google.com/file/d/15fPqdk-lGVUxnj7DWaLZQJrqjx8Tk0NX/view?usp=sharing)
