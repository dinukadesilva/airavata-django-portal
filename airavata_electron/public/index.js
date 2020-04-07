const {app, shell, BrowserWindow, protocol, session} = require('electron')
const path = require('path')
const url = require('url')

let mainWindow


function createWindow() {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadURL(url.format({
    pathname: 'index.html',/* Attention here: origin is path.join(__dirname, 'index.html') */
    protocol: 'file',
    slashes: true
  }))

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  // Handle external links : external links are opened on the os default browser.
  mainWindow.webContents.on('new-window', function (event, url) {
    event.preventDefault()
    shell.openExternal(url)
  })

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

}

app.on('ready', () => {
  protocol.interceptFileProtocol('file', (request, callback) => {
    const url = request.url.substr(7)/* all urls start with 'file://' */
    callback({path: path.normalize(`${__dirname}/${url}`)})
  }, (err) => {
    if (err) console.error('Failed to register protocol')
  })
  createWindow()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

