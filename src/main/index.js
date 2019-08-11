import {
  app,
  BrowserWindow,
  Tray,
  Menu,
  nativeImage
} from 'electron'
const path = require('path')

const fs = require('fs')



/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

var icon = path.resolve(path.join(__static, 'tray16.png'))

let tray = null

//var staticFolder = path.resolve(path.join(__dirname,'ico','favicon.ico'))


if (process.platform === "darwin") {
  app.dock.hide()
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */

  mainWindow = new BrowserWindow({
    height: 600,
    useContentSize: true,
    width: 1000,
    icon: path.join(__static, 'icon256.ico')
  })

  if (process.platform !== 'darwin') {
    mainWindow.setMenuBarVisibility(false)
  }
  mainWindow.loadURL(winURL)

  //const tray = new Tray(`${__dirname}/favicon.ico`);
  //const tray = new Tray(require('path').join(__dirname, "./src/main/favicon.ico"))
  createTray()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}



app.on('ready', createWindow)

app.on('second-instance', (event, commandLine, workingDirectory) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    } else if (!win.isVisible()) {
      mainWindow.show();
    }
    mainWindow.focus();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

function createTray() {

  //메인 BrowserWindow에서 닫기를 누를시 히든처리가 선행되어야함.
  mainWindow.on('close', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  // Tray 를 나타낼 아이콘 경로. 미리 __static 이 root/static 폴더로 지정되어 있다.
  tray = new Tray(path.join(__static, 'tray16.png'))


  tray.setToolTip('jgNote : Markdown Note Application')
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    mainWindow.show();
  })
  var contextMenu = Menu.buildFromTemplate([{
      label: `jgNote v${app.getVersion()}`,
      click: function() {
        mainWindow.toggleDevTools();
      }
    },
    /* Do Not Need : Implemented in frontend
    {
      label: 'Print',
      click: function() {
        mainWindow.webContents.printToPDF({
          marginsType: 2,
          printBackground: true,
          printSelectionOnly: false,
          landscape: false
        }, (error, data) => {
          if (error) throw error
          fs.writeFile('/tmp/print.pdf', data, (error) => {
            if (error) throw error
            console.log('Write PDF successfully.')
          })
        })
      }
    },*/
    {
      label: 'Close',
      click: function() {
        mainWindow.close();
        app.quit();
        app.exit();
      }
    }
  ])
  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu)
  })
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
