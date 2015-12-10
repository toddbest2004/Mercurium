var mongoose = require('mongoose')
var Schema = mongoose.Schema

var gameSchema = new Schema({
	characters: [{type: Schema.Types.ObjectId, ref: 'Character'}],
	// map: [{tiles}]

})

var game = mongoose.model('game', gameSchema)
module.exports = game