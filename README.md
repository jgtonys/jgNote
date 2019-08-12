## [Electron + Vue.js + Firebase] Cross-Platform Markdown Note Application

- No Local Database [online sync, enable offline]
- Cross-Platform [Windows,Mac,Linux,(mobile)]
- Markdown [export PDF, image auto uploading to github]
- Custom keyboard shortcuts


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

**execute installer**

After install, jgNote will be automatically powered up but **nothing will be shown**. **This is because there is no firebase & github settings for jgNote**. Follow below instructions.

**copy settingFiles to installed Folder**

copy `firebase.json` and `github.json` to

- mac : `/Applications/jgnote.app/`
- windows : `C:/Users/{USERNAME}/AppData/Local/Programs/jgnote/`

And write `firebase.json` by creating [firestore database](https://firebase.google.com). Also github api access token and repository must be in `github.json`

This [Video](https://youtu.be/N1QT2c72KCI) shows **how to set json files**
