'use strict'

// catch all errors
process.on('uncaughtException', function (err) {
    updateStatus(`JavaScript Error: ${err.message}`)
})

// silence the annoying 'errors' from Unity
var AchievementUnityComm = {
    doUnityLoaded: function() {},
    doUnityGameStarted: function() {}
}
function cnGameTracking() {}

var gui = require('nw.gui')
var server = require('../server/server.js')
var path = require('path')
var registry = require('../windows/registry.js')

// show the dev tools
gui.Window.get().showDevTools()

// resize the window accordingly
if (process.platform === 'win32') {
    gui.Window.get().resizeTo(906, 629)
} else if (process.platform === 'darwin') {
    gui.Window.get().resizeTo(900, 622)
}

// location of the game save file, in the AppData/Local file
var saveFile = path.join(gui.App.dataPath, 'gamedata.json')

// little function for updaing text on splash screen
function updateStatus(text) {
    console.log(text)
    document.getElementById('status').innerText = text
}

// check the requirements have been met
var unityFound = false
for (var i = 0; i < navigator.mimeTypes.length; i++) {
    var mime = navigator.mimeTypes[i]
    if (mime.type === 'application/vnd.unity') {
        unityFound = !! mime.enabledPlugin
        break
    }
}

if (!unityFound) {
    // unity isn't there, die
    updateStatus('Error: Unity Web Player not found')
} else {

    // update the registry value so Unity knows where the plugin is
    var res = registry.modifyRegistry()
    if (!res) {
        updateStatus('Error: Couldn\'t update registry value')
    } else {

        // start the server
        updateStatus('Starting local server...')
        server.start(saveFile, function (port) {
            updateStatus('Loading scripts...')

            // load the scripts in the app
            var scripts = [
                `http://127.0.0.1:${port}/www.cartoonnetwork.com/static/global/js/jquery.min.js`,
                `http://127.0.0.1:${port}/www.cartoonnetwork.com/static/global/js/jquery.md5.js`,
                `http://127.0.0.1:${port}/www.cartoonnetwork.com/static/js/jquery.min.js`,
                `http://127.0.0.1:${port}/www.cartoonnetwork.com/static/global/js/jquery-migrate.min.js`,
                `http://127.0.0.1:${port}/www.cartoonnetwork.com/static/global/js/jquery.shim.js`,
                `http://127.0.0.1:${port}/www.cartoonnetwork.com/games/_tools/static/js/UnityObject2.js`,
                'unityRequest.js'
            ]
            loadScripts(scripts, function () {
                console.log('loaded scripts, waiting with splash screen')
                setTimeout(function() {
                    loadGame(port)
                }, 2000)
            })
        })
    }
}

var _cnglobal = {}
function loadGame (port) {
    var config = {
      width: 900,
      height: 600,
      params: {
        "disableContextMenu": true,
        "backgroundcolor": "ffffff",
        "bordercolor": "ffffff",
        "textcolor": "000000",
        "pluginspage": "https://unity3d.com/unitywebplayer.html",
        "logoimage": "./loadimage.png"
      }
    }

    var filePath = `http://127.0.0.1:${port}/i.cdn.turner.com/toon/games/dragons/wild-skies/main.unity3d`

    updateStatus('Loading game...')
    document.body.removeChild(document.getElementById('temp-credits'))
    _cnglobal.unityObj = new UnityObject2(config)
    _cnglobal.unityObj.initPlugin(document.getElementById('game-swf'), filePath)
}


function loadScripts(scripts, cb, count) {
    if (typeof count === 'undefined') {
        count = 0
    }
    if (count === scripts.length) {
        return cb()
    }

    loadScript(scripts[count], function () {
        count++
        loadScripts(scripts, cb, count)
    })
}


function loadScript(url, cb) {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    script.onload = cb
    document.body.appendChild(script)
}
