var mongoose = require('mongoose')
var Schema = mongoose.Schema

var characterSchema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	location: {x:Number,y:Number},
	actions: [{range: Number,name:String,actionPoints:Number}],
	movements: Number,
	name: String,
	image: String,
	characterClass: String,
	currentHealth: Number,
	maxHealth: Number,
	attack: Number,
	defense: Number
	// statusEffects: []
})

var character = mongoose.model('character', characterSchema)
module.exports = character