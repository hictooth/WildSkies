'use strict'

module.exports = {
    start: start
}

var path = require('path')
var http = require('http')
var fs = require('fs')
var url = require('url')
var rootdir = require('../rootdir.js')
var gamedata = require('./gamedata.js')

var saveFile = null

var bind_port = 0 // means use any free port
var servepath = path.join(rootdir.rootdir, 'server', 'data')
var configTemplate = path.join(servepath, 'i.cdn.turner.com', 'toon', 'games', 'dragons', 'wild-skies', 'config.xml')
var savingServerBasePath = '/www.cartoonnetwork.com/dragonsvc/'


function crossdomain (request, response) {
    var content = '<?xml version="1.0" ?><cross-domain-policy><allow-access-from domain="*" /></cross-domain-policy>'
    response.writeHead(200, { 'Content-Type': 'text/xml' })
    return response.end(content, 'utf-8')
}

//function savingServer (r1, r2) { return crossdomain(r1, r2) }

function savingServer (request, response) {
    // this is the saving server
    if (request.method === 'POST') {
        // we are getting the data here
        var data = []
        request.on('data', function (chunk) {
            data.push(chunk)
        })
        request.on('end', function () {
            var jsonData = JSON.stringify({
                version: Number(url.parse(request.url, true).query.version) + 1,
                data: JSON.parse(data)
            })
            gamedata.saveData(saveFile, jsonData)
            response.writeHead(200, { 'Content-Type': 'text/json' })
            return response.end(jsonData, 'utf-8')
        })
    } else {
        // we are saving the data here
        response.writeHead(200, { 'Content-Type': 'text/json' })
        gamedata.getData(saveFile, function (err, data) {
            if (err) {
                window.console.error('error getting data:', err)
                return response.end('{}', 'utf-8')
            }
            return response.end(data, 'utf-8')
        })
    }
}

function configFile (request, response) {
    // this is the config file, we have to replace the port in here
    fs.readFile(configTemplate, 'utf8', function (err, data) {
        // if error reading file, then yikes!
        if (err) {
            return console.error(err)
        }
        var port = server.address().port
        var content = data.replace(/\$SERVER_PORT/g, port)
        response.writeHead(200, { 'Content-Type': 'text/xml' })
        return response.end(content, 'utf-8')
    })
}

function staticFileServer(request, response) {
    // this is the static file server
    var uri = url.parse(request.url).pathname
    var filename = path.join(servepath, uri)
    fs.stat(filename, function (err, stats) {
        if (err || !stats.isFile()) {
            // file does not exist or path is not a file, return a 404
            response.writeHead(404, { "Content-Type": "text/plain" })
            return response.end('404 Not Found\n', 'utf-8')
        }

        // file exists, serve it up
        var stream = fs.createReadStream(filename, {
            highWaterMark: 64 * 1024
        })
        return stream.pipe(response)
    })
}


var server = http.createServer(function (request, response) {
    var uri = url.parse(request.url).pathname
    console.log('uri is', uri)
    if (uri.startsWith('/crossdomain.xml')) {
        return crossdomain(request, response)
    } else if (uri.startsWith(savingServerBasePath)) {
        return savingServer(request, response)
    } else if (uri.startsWith('/i.cdn.turner.com/toon/games/dragons/wild-skies/config.xml')) {
        return configFile(request, response)
    } else {
        return staticFileServer(request, response)
    }
})

function start(file, cb) {
    saveFile = file
    server.listen(bind_port, '127.0.0.1', function () {
        var port = server.address().port
        console.log('listening on port', server.address().port)
        cb(port)
    })
}
