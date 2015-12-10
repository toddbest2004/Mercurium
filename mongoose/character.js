var mongoose = require('mongoose')
var Schema = mongoose.Schema

var characterSchema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	location: {x:Number,y:Number,z:Number},
	maxHealth: Number,
	attack: Number,
	defense: Number

	// touch: Number,
	// timecount: Number,
	// slug: {type: Schema.Types.ObjectId, ref: 'Realm'},
})

var character = mongoose.model('character', characterSchema)
module.exports = character