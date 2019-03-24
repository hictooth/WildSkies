'use strict'

var express = require('express')
var fs = require('fs')

var port = 8082
var app = express()
app.use(express.json())


app.get('/crossdomain.xml', function (req, res) {
  var xml = '<?xml version="1.0" ?><cross-domain-policy><allow-access-from domain="*" /></cross-domain-policy>'
  res.set('Content-Type', 'text/xml')
  res.send(xml)
})


app.get('/www.cartoonnetwork.com/dragonsvc/v2/user/dragons/', function (req, res) {
  var data = localStorage.getItem('gamedata')
  res.set('Content-Type', 'text/json')
  res.send(data)
})


app.post('/www.cartoonnetwork.com/dragonsvc/v2/user/dragons/', function (req, res) {
  var gamedata = req.body
  var version = Number(req.query.version) + 1
  var savedata = {
    version: version,
    data: gamedata
  }
  var jsonData = JSON.stringify(savedata)
  localStorage.setItem('gamedata', JSON.stringify(savedata))

  res.set('Content-Type', 'text/json')
  res.send(jsonData)
})


app.listen(port, function () {
  console.log(`Server listening`)
})
