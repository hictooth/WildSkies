'use strict'

var NwBuilder = require('nw-builder')

var nw = new NwBuilder({
    files: './**/**',
    version: '0.12.3',
    flavour: 'normal',
    platforms: ['osx64', 'win32'],
    appName: 'Wild Skies',
    appVersion: '2.0.0',
    buildDir: './build',
    cacheDir: './cache',
    macIcns: './mac.icns',
    winIco: './windows.ico'
})

// Log stuff you want
nw.on('log',  console.log)

nw.build().then(function () {
    console.log('all done!')
}).catch(function (error) {
    console.error(error)
})
