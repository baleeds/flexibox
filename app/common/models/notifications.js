var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
    userId: Schema.ObjectId,
    eventId: Schema.ObjectId
});

module.exports = mongoose.model('Notifications',NotificationSchema );