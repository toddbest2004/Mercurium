var express = require("express");
var router = express.Router();

var db = require('./../mongoose')

router.get("/", function(req,res){
	// createGame()
	db.game.findOne({}).populate('characters').populate('turnOrder').exec(function(err, game){
		db.character.findOne({name:"test"}).then(function(character){
			// character.save()
		// 	addExistingCharacterToGame(character, game)
			// game.characters[0].movements=10
			// console.log(characterMove(game.characters[0],3, 1))
			game.map=[]
			game.length = 10
			game.height = 11 //actual height will be one less
			game.round = 0
			game.turn = 1
			for(var y=0; y<game.height;y++){
				for(var x=0; x<parseInt(game.length+game.height/2); x++){
					if(y+x*2>game.height&&y+2*x<game.length*2+game.height){
						game.map.push({x:x, y:y, texture:Math.floor((Math.random() * 2) + 1)})
					}else{
						game.map.push(null)
					}
				}
			}
			// character.location = {x:10, y:3}
			// character.movements = 10
			// character.save()
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

//route for sending moves to a game.
//first, validate a user is logged in,
//then validate that the game belongs to the user
//validate gamestates are correct
//validate move
//perform move
//send a success/error response
//user's browser will receive response and request a gamestate update.
router.post("/:id", function(req,res){
	var move = req.body.move
	db.game.findOne({}).populate('characters').populate('turnOrder').exec(function(err, game){
		if(err){
			moveError(err, game, res)
			return
		}

		var currentCharacter = game.turnOrder[game.turn]
		if(currentCharacter.id===move.character){
			move.moves.forEach(function(thisMove){
				if(thisMove.action===0){//character is moving
					var distance = getDistance(currentCharacter.location.x, currentCharacter.location.y, thisMove.at.x, thisMove.at.y)
					if(distance<=currentCharacter.movements){
						currentCharacter.movements-=distance
						currentCharacter.location.x=thisMove.at.x
						currentCharacter.location.y=thisMove.at.y
					}else{
						moveError("Move out of distance", game, res)
						return
					}
					// console.log(distance)
				}
			})
			game = incrementTurn(game)
			saveGame(game)
		}else{
			moveError("Moving incorrect character", game, res)
			return
		}
		console.log(game)

		getGame(game._id, res)
	})
	//validate user session
	//make sure user's current game matches the game they are sending
	//make sure the current game is owned by user
	//make sure the characterId of move = currentTurn id
	//forEach move in move array:
		//validate move
		//tentatively run move
	//if all moves are valid, run each move, one by one, updating game state
	//if moves are not valid, return to previous gamestate, return gamestate with error
	//after all moves are run
		//increment turn counter
		//if the current turn is opponent's character, run ai moves
		//increment turn counter.
		//if turncounter>turns, new round
			//do end of turn events
			//round++, start new round, add movements, do start of turn events
			//calculate turn order
		//send success plus new gamestate
})

function getGame(id, res){
	console.log(id)
	db.game.findOne({_id:id}).populate('characters').populate('turnOrder').exec(function(err, game){
		res.send(game)
	})
}

function moveError(error, game, res){
	game.error = error
	res.send(game)
}

function incrementTurn(game){
	game.turn++
	if(game.turn===game.turnOrder.length){//last character moved
		game.round++
		game.turn=0
		game.turnOrder.forEach(function(character){
			character.movements+=4
		})
	}
	return game
}

function saveGame(game){
	game.turnOrder.forEach(function(character){
		character.save()
	})
	game.save()
}

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