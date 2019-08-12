## [Electron + Vue.js + Firebase] Cross-Platform Markdown Note Application

- No Local Database [online sync, enable offline]
- Cross-Platform [Windows,Mac,Linux,(mobile)]
- Markdown [export PDF, image auto uploading to github]
- Custom keyboard shortcuts

![image.png](https://github.com/jgtonys/upload_test/blob/master/screenshot-Mon%20Aug%2012%202019%2015:24:12%20GMT%2B0900%20%28KST%29.png?raw=true)

![5C418357-0607-4E62-8AE5-65C71B194EE9.png](https://github.com/jgtonys/upload_test/blob/master/screenshot-Mon%20Aug%2012%202019%2015:24:29%20GMT%2B0900%20%28KST%29.png?raw=true)


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

**copy settingFiles to installed Folder**

This [Video](https://youtu.be/N1QT2c72KCI) shows **how to set json files**

*In firebase setting, google analytics is optional. And if you do not need image uploading for markdown note, `github.json` can be empty. Only firebase.json must be set to execute jgNote correctly*

copy `firebase.json` and `github.json` to

- mac : `/Applications/jgnote.app/`
- windows : `C:/Users/{USERNAME}/AppData/Local/Programs/jgnote/`


And write `firebase.json` by creating [firestore database](https://firebase.google.com). Also github api access token and repository must be in `github.json`.



## Installer + json template Link

[Windows](https://drive.google.com/file/d/1Et2UXvV02zO-SvmB4x1e53wO27tDfT_m/view?usp=sharing)

[Mac](https://drive.google.com/file/d/15fPqdk-lGVUxnj7DWaLZQJrqjx8Tk0NX/view?usp=sharing)
