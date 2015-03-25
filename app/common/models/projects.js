// ------------------------------------------------------------
// Model used by mongoose to define the project schema
//
// Projects contain sets, which contain posts, which have comments
// and images.
//-------------------------------------------------------------
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
	name: { type:String, required: true },
	description: String,
	owners: [],
	createdAt: {type: Date, default: Date.now},
	editedAt:{type: Date, default: Date.now},
	commenters: [{
		name: String,
		email: String,
		_id: Schema.ObjectId
	}],
	tags: [{
		text: String
	}],
	entryURL: String,
	setsURL: String,
	sets: [{
		name: String,
		description: String,
		entryURL: String,
		postsURL: String,
		createdAt:{type: Date, default: Date.now},
		editedAt:{type: Date, default: Date.now},
		tags: [{
			text: String
		}],
		posts: [{
			name: String,
			description: String,
			imageURL: String,
			entryURL: String,
			createdAt:{type: Date, default: Date.now},
			editedAt:{type: Date, default: Date.now},
			tags: [{
				text: String
			}],
			commentsURL: String,
			comments: [{
				smallest: {
					x: Number,
					y: Number
				},
				width: Number,
				height: Number,
				color: String,
				number: Number,
				posterName: String,
				txt: String,
                replies : [{
                    posterName: String,
                    txt: String
                }]
			}]
		}]
	}]
});

module.exports = mongoose.model('Project', ProjectSchema);