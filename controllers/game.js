var express = require("express");
var router = express.Router();

var db = require('./../mongoose')

router.get("/", function(req,res){
	db.game.findOne({}).then(function(game){
		res.send(game)
	})
})

module.exports = router;