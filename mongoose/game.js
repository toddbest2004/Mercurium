var mongoose = require('mongoose')
var Schema = mongoose.Schema

var gameSchema = new Schema({
	characters: [{type: Schema.Types.ObjectId, ref: 'character'}],
	map: {
		x: Number,
		y: Number,
		z: Number,
		height: Number,
		passable: Boolean
	}

})

var game = mongoose.model('game', gameSchema)
module.exports = game