// ------------------------------------------------------------
// Model used by mongoose to define the user schema.
//-------------------------------------------------------------
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: { type:String, required: true },
	displayName: { type:String, required: true},
	imageURL: String,
	emailSettings: Number,
	projectsVisible: [Schema.ObjectId],
});

module.exports = mongoose.model('User', UserSchema);