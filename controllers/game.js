var express = require("express");
var router = express.Router();

var db = require('./../mongoose')

router.get("/:id", function(req,res){
	if(!req.session.username){
		res.status(404).send({result:false,error:"You are not logged in."})
		return
	}
	var gameId = req.params.id.toString()
	db.usermodel.findOne({username:req.session.username},function(err, user){
		if(err||!user){
			res.status(404).send({result:false,error:"Error reading database."})
			return
		}
		if(user.games.indexOf(gameId)===-1){
			res.status(404).send({result:false,error:"That is not your game."})
			return
		}
		db.game.findOne({_id:gameId}, function(err, game){
			if(err||!game){
				res.status(404).send({result:false,error:"Could not load your game."})
				return
			}
			//everything loaded fine, lets send a game!
			saveGame(game, res)
		})
	})
})

router.post("/create", function(req, res){
	console.log('creating')
	if(!req.session.username){
		res.status(404).send({result:false,error:"You are not logged in."})
		return
	}
	db.usermodel.findOne({username:req.session.username},function(err, user){
		if(err||!user){
			res.status(404).send({result:false,error:"Error reading database."})
			return
		}
		console.log("valid")
		createGame(function(game){
			user.games.push(game.id)
			user.save()
			res.send({result:true})
		})
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
	var gameId = req.params.id.toString()
	var move = req.body.move
	db.game.findOne({_id:gameId}).exec(function(err, game){
		if(err){
			moveError(err, game, res)
			return
		}

		var currentCharacter = getCurrentCharacter(game)
		if(currentCharacter.id===move.character){
			move.moves.forEach(function(thisMove){
				var distance = getDistance(currentCharacter.location.x, currentCharacter.location.y, thisMove.at.x, thisMove.at.y)
				if(thisMove.action===0){//character is moving
					if(distance<=currentCharacter.movements){
						currentCharacter.movements-=distance
						currentCharacter.location.x=thisMove.at.x
						currentCharacter.location.y=thisMove.at.y
					}else{
						moveError("Move out of distance", game, res)
						return
					}
					// console.log(distance)
				}else{//character is attacking/using ability
					var action = currentCharacter.actions[thisMove.action]
					if(distance<=action.range&&distance>0&&action.actionPoints<=currentCharacter.movements){
						if(performAction(game, currentCharacter, thisMove)){
							currentCharacter.movements-=action.actionPoints
						}else{
							moveError("Untargetted attack.", game, res)
						}
					}else{
						moveError("Improper move sent", game, res)
					}
				}
			})
			game = incrementTurn(game)
			saveGame(game, res)
		}else{
			moveError("Moving incorrect character", game, res)
			return
		}
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

function createGame(callback){
	var game = new db.game()
	console.log(game)
	game.characters=getCharacterData()
	game.inProgress=true
	game.turnOrder=[0,1,2,3,4,5,6,7]
	game.turn=0
	game.round=0
	game.map=[]
	game.length = 10
	game.height = 11 //actual height will be one less
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
	game.save(function(err, savedgame){
		callback(savedgame)
	})

			// saveGame(game, res)

	// 	// db.character.findOne({}).then(function(character){
	// 		game.characters[0].location.x=2
	// 		game.save()
	// 	// })
	// 	res.send(game)
	// })
}

function performAction(game, character, move){
	if(target = tileOccupied(game, move.at.x, move.at.y)){
		attack(character.attack, target)
		return true
	}
	return false
}

function getGame(id, res){
	console.log(id)
	db.game.findOne({_id:id}).exec(function(err, game){
		res.send(game)
	})
}

function getCurrentCharacter(game){
	return game.characters[game.turnOrder[game.turn]]
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
		game.characters.forEach(function(character){
			character.movements+=4
		})
	}

	if(checkDeath(game.characters[game.turn])){
		var teamAlive = [0,0]
		game.characters.forEach(function(character){
			if(!checkDeath(character)){
				teamAlive[character.team-1]++
			}
			if(teamAlive[0]===0||teamAlive[1]===0){
				game.inProgress=false
				console.log("GAME OVER")
			}else{
				incrementTurn(game)
			}
		})
	}
	return game
}

 function tileOccupied(game, x, y){
    var result = false
    //go through characters array and see if any characters are present at location
    game.characters.forEach(function(character){
      if(character.location.x==x && character.location.y==y){
        result = character
      }
    })
    return result
  }

function saveGame(game, res){
	// game.characters.forEach(function(character){
	// 	character.save()
	// })
	game.save(function(err, data){
		console.log("sendingGame")
		res.send(game)
		// res.status(404).send('error')
	})
}

// function createGame(options){
// 	db.game.create(options).then(function(game){
// 		return game;
// 	})
// }

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
		return true
	}else{
		return false
	}
}

function attack(attack, target){
	//damage = attack+-50%'
	//adjusted damage = damage*(10-defense)/10 ((2) defense=20% damage reduction)
	var damage = Math.round(attack * (Math.random()+.5))
	var adjustedDamage = Math.round(damage*(10-target.defense)/10)
	target.currentHealth -= adjustedDamage
	checkDeath(target)
	console.log("attacking", damage, adjustedDamage)
}

function checkDeath(character){
	if(character.currentHealth<=0){
		character.currentHealth=0
		return true
	}
	return false
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

function getCharacterData(){
	return [{
		location:{x:9,y:1},
		actions:[{range:1,name:"Move",actionPoints:1},{range:1,name:"Attack",actionPoints:2.5}],
		movements:5,
		name:"Character1",
		image:"images/character1.png",
		team:1,
		characterClass:"Knight",
		currentHealth:100,
		maxHealth:100,
		speed:5,
		attack:10,
		defense:5
	},
	{
		location:{x:7,y:1},
		actions:[{range:1,name:"Move",actionPoints:1},{range:3,name:"Attack",actionPoints:2.5}],
		movements:5,
		name:"Character2",
		image:"images/character2.png",
		team:1,
		characterClass:"Archer",
		currentHealth:80,
		maxHealth:80,
		speed:5,
		attack:10,
		defense:2
	},
		{
		location:{x:11,y:1},
		actions:[{range:1,name:"Move",actionPoints:1},{range:3,name:"Attack",actionPoints:2.5}],
		movements:5,
		name:"Character2",
		image:"images/character3.png",
		team:1,
		characterClass:"Archer",
		currentHealth:80,
		maxHealth:80,
		speed:5,
		attack:10,
		defense:2
	},
		{
		location:{x:13,y:1},
		actions:[{range:1,name:"Move",actionPoints:1},{range:3,name:"Attack",actionPoints:2.5}],
		movements:5,
		name:"Character4",
		image:"images/character2.png",
		team:1,
		characterClass:"Archer",
		currentHealth:80,
		maxHealth:80,
		speed:5,
		attack:10,
		defense:2
	},
		{
		location:{x:7,y:10},
		actions:[{range:1,name:"Move",actionPoints:1},{range:3,name:"Attack",actionPoints:2.5}],
		movements:5,
		name:"Character5",
		image:"images/character5.png",
		team:1,
		characterClass:"Archer",
		currentHealth:80,
		maxHealth:80,
		speed:5,
		attack:10,
		defense:2
	},
		{
		location:{x:9,y:10},
		actions:[{range:1,name:"Move",actionPoints:1},{range:3,name:"Attack",actionPoints:2.5}],
		movements:5,
		name:"Character6",
		image:"images/character6.png",
		team:2,
		characterClass:"Archer",
		currentHealth:80,
		maxHealth:80,
		speed:5,
		attack:10,
		defense:2
	},
	{
		location:{x:5,y:10},
		actions:[{range:1,name:"Move",actionPoints:1},{range:3,name:"Attack",actionPoints:2.5}],
		movements:5,
		name:"Character6",
		image:"images/character7.png",
		team:2,
		characterClass:"Archer",
		currentHealth:80,
		maxHealth:80,
		speed:5,
		attack:10,
		defense:2
	},
	{
		location:{x:3,y:10},
		actions:[{range:1,name:"Move",actionPoints:1},{range:3,name:"Attack",actionPoints:2.5}],
		movements:5,
		name:"Character6",
		image:"images/character8.png",
		team:2,
		characterClass:"Archer",
		currentHealth:80,
		maxHealth:80,
		speed:5,
		attack:10,
		defense:2
	}]
}