'use strict'

module.exports = {
    modifyRegistry: modifyRegistry
}

var path = require('path')
var child_process = require('child_process')
var rootdir = require('../rootdir.js')

var WILDSKIES_REGISTRY_PATH = 'HKCU\\Software\\HTTYD\\WildSkies'
var KEY = 'Directory'
var TYPE = 'REG_SZ'

function modifyRegistry () {
    if (process.platform !== 'win32') {
        return true
    }
    // create the entry, overwriting if necessary
    var pluginDirectory = path.join(rootdir.rootdir, 'windows', 'WebPlayer')
    var res = child_process.spawnSync('reg', ['add', WILDSKIES_REGISTRY_PATH, '/f', '/v', KEY, '/t', TYPE, '/d', pluginDirectory])
    var success = res.status === 0
    return success
}
