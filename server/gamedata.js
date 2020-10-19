'use strict'

module.exports = {
    getData: getData,
    saveData: saveData
}

var fs = require('fs')
var path = require('path')

function getData (saveFile, cb) {
    fs.access(saveFile, fs.W_OK | fs.R_OK, function (err) {
        if (err) {
            return cb(null, '{}')
        }
        fs.readFile(saveFile, 'utf8', function (err2, data) {
            if (err2) {
                return cb(`error reading save game file: ${err2}`)
            }
            try {
                return cb(null, data)
            } catch (e) {
                return cb(`error parsing save game file: ${e}`)
            }
        })
    })
}

function saveData (saveFile, data) {
    fs.writeFile(saveFile, data, 'utf8', function (err) {
        if (err) {
            return window.console.error('error writing save game file:', err)
        }
    })
}
