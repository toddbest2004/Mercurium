var express = require('express')
var db = require('./mongoose')
var path = require('path')

var app = express()

app.use(express.static(path + '/static'))


var gameCtrl = require("./controllers/game")
app.use("/game", gameCtrl)

var port = process.env.PORT || 3000
var serverip = process.env.IP || "localhost"

app.listen(port, serverip)
console.log('Server running at '+serverip+":"+port)