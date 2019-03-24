var app = require('app')
var BrowserWindow = require('browser-window')
var path = require('path')

app.commandLine.appendSwitch('disable-smooth-scrolling')

var mainWindow = null

// get the unity web player plugin name - platform specific
var pluginName = 'unity.dll'
if (process.platform === 'darwin') {
  pluginName = 'unity.plugin'
}

app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 622,
    'web-preferences': {
      plugins: true,
      'extra-plugin-dirs': [__dirname + '/plugins/', __dirname + '/plugins/' + pluginName]
    },
    'auto-hide-menu-bar': true
  })

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/client/index.html')

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null
    app.quit()
  })
})
