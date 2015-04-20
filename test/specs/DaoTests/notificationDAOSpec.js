var NotificationDAO = require('../../../server/dao/notificationDAO');
var TestUtils = require('../../testingUtils');

var async = require('async');

describe("NotificationDAO Tests", function () {

    beforeEach(function (done) {
        TestUtils.loadTestData(done);
    });

    describe("getNotificationsFor", function () {
        it("counts the number of notifications of a user on a specific object", function (done) {
            async.waterfall([
                function (callback) {
                    NotificationDAO.getNotificationsFor("54d81fffb46e200418000005", "54d82057b46e200418000006", callback);
                }
            ], function (err, count) {
                if (err) {
                    throw new Error(err);
                } else {
                    expect(count).toBe(1);
                }
                done();
            });

        });
    });

    describe("getAllNotificationsFor", function () {
        it("counts the number of notifications of a user", function (done) {
            async.waterfall([
                function (callback) {
                    NotificationDAO.getAllNotificationsFor("54d81fffb46e200418000005", callback);
                }
            ], function (err, count) {
                if (err) {
                    throw new Error(err);
                } else {
                    expect(count).toBe(2);
                }
                done();
            });

        });
    });
});