var mongoose = require('mongoose')
var Schema = mongoose.Schema

var gameSchema = new Schema({
	characters: [{type: Schema.Types.ObjectId, ref: 'character'}],
	length: Number,
	height: Number,
	map: [{x:Number, y:Number, texture:Number}],
	round: Number,
	turnOrder: [Number],
	turn: Number

})

var game = mongoose.model('game', gameSchema)
module.exports = game