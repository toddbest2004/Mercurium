var express = require("express");
var router = express.Router();

var db = require('./../mongoose')

router.get("/", function(req,res){
	// createGame()
	db.game.findOne({}).populate('characters').exec(function(err, game){
		// db.character.findOne().then(function(character){
			// addCharacter(character, game)
			// game.characters[0].movements=10
			console.log(characterMove(game.characters[0],3,-1))
			game.map=[{x:3, y:0, texture:1},
				{x:1, y:0, texture:1},
				{x:2, y:0, texture:2},
				{x:0, y:1, texture:2},
				{x:1, y:1, texture:1},
				{x:2, y:1, texture:1},
				{x:3, y:1, texture:2},
				{x:0, y:2, texture:2},
				{x:1, y:2, texture:1},
				{x:2, y:2, texture:1}]
			game.save()
			res.send(game)
		// })
	// 	// db.character.findOne({}).then(function(character){
	// 		game.characters[0].location.x=2
	// 		game.save()
	// 	// })
	// 	res.send(game)
	})
})

function createGame(options){
	db.game.create(options).then(function(game){
		return game;
	})
}

function addExistingCharacterToGame(character, game){
	game.characters.push(character)
	game.save().then(function(game){
		return game
	})
}

function addNewCharacterToGame(game){

}

function characterMove(character,x,y){//does not yet test for occupied space.
	var z = getZ(x,y)
	var distance = getDistance(character.location.x,character.location.y,x,y)
	console.log(distance, character.movements)
	if(distance>0&&distance<character.movements){
		character.location={x:x,y:y,z:z}
		character.movements -= distance
		character.save()
		return true
	}else{
		return false
	}
}

function attack(character, x, y){
	var z = getZ(x,y)

}

function getDistance(x1,y1,x2,y2){
	var z1 = -(x1+y1)
	var z2 = -(x2+y2)
	var distance = (Math.abs(x1-x2)+Math.abs(y1-y2)+Math.abs(z1-z2))/2
	return distance
}

function getZ(x, y){
	return -(x+y)
}

module.exports = router;