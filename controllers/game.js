var express = require("express");
var router = express.Router();

var db = require('./../mongoose')

router.get("/", function(req,res){
	// createGame()
	db.game.findOne({}).populate('characters').populate('map').exec(function(err, game){
		db.character.findOne().then(function(character){
			// addCharacter(character, game)
			// game.characters[0].movements=10
			// console.log(characterMove(game.characters[0],3, 1))
			// game.map=[]
			// for(var i=0; i<10;i++){
			// 	for(var j=0-parseInt(i/2); j<10-parseInt(i/2); j++){
			// 		createTile(j,i,game)
			// 	}
			// }
			// character.location = {x:1, y:1}
			// character.movements = 10
			// game.turnOrder[0]=character
			db.game.find({'map.x':1, 'map.y':1}, function(err, tile){
				console.log(tile.x, tile.y)
			})
			// game.map()
			game.save()
			res.send(game)
		})
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

function createTile(x, y, game){
	db.tile.create({x:x, y:y, texture:Math.floor((Math.random() * 2) + 1)}, function(err, tile){
		game.map.push(tile)
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

function characterMove(character,x,y){
//does not yet test for occupied space.
//right now character location is not normalized
//make sure character location gets updated both in map tile occupiedBy
//and character.location.
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