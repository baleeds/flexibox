// ------------------------------------------------------------
// Model used by mongoose to define the user schema.
//-------------------------------------------------------------
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: String,
	imageURL: String,
	emailSettings: Number,
	projectsVisible: [Schema.ObjectId],
	role: {type: String, default: "commenter"},
	local            : {
		email        : String,
		password     : String
	}
});

// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};


module.exports = mongoose.model('User', UserSchema);