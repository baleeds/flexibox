var Notification = require('../../app/common/models/notifications');

module.exports = {
    getNotificationsFor: function(userId, objectId, callback){
        Notification.count({userId: userId, eventId: objectId}, function(err, notifications){
            if(err){
                callback(err);
            } else {
                callback(null, notifications);
            }
        });
    },
    getAllNotificationsFor: function(userId, callback){
        Notification.count({userId: userId}, function(err, notifications){
            if(err){
                callback(err);
            } else {
                callback(null, notifications);
            }
        });
    },
    clearNotificationsFor: function(userId, objectId, callback){
        Notification.remove({userId: userId, eventId: objectId}, function(err){
            if(err){
                callback(err);
            } else {
                callback(null);
            }
        });
    }
};