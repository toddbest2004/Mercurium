var express = require('express')
var db = require('./mongoose')
var path = require('path')
var bodyParser = require('body-parser')

var app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var gameCtrl = require("./controllers/game")
app.use("/game", gameCtrl)
app.get('/*', function(req,res){
	res.sendFile(path.join(__dirname, 'public/index.html'))
})

var port = process.env.PORT || 3000
var serverip = process.env.IP || "localhost"

app.listen(port, serverip)
console.log('Server running at '+serverip+":"+port)