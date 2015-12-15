var mongoose = require('mongoose')
var Schema = mongoose.Schema

var gameSchema = new Schema({
	characters: [{
		location: {x:Number,y:Number},
		actions: [{range: Number,name:String,actionPoints:Number}],
		movements: Number,
		name: String,
		image: String,
		team: Number,
		characterClass: String,
		currentHealth: Number,
		maxHealth: Number,
		speed: Number,
		attack: Number,
		defense: Number
	}],
	inProgress:Boolean,
	length: Number,
	height: Number,
	map: [{x:Number, y:Number, texture:Number}],
	round: Number,
	turnOrder: [Number],
	turn: Number

})

var game = mongoose.model('game', gameSchema)
module.exports = game