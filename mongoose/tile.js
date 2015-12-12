var mongoose = require('mongoose')
var Schema = mongoose.Schema

var tileSchema = new Schema({
	x: Number,
	y: Number,
	texture: Number,
	height: Number,
	passable: Boolean,
	occupiedBy: [{type: Schema.Types.ObjectId, ref: 'character'}]
})

var tile = mongoose.model('tile', tileSchema)
module.exports = tile