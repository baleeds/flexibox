var TestUtils = require('../../testingUtils');
var SomeDAO = require('../../../server/dao/someDAO');

var async = require('async');

describe("someDAO Tests", function () {

    beforeEach(function (done) {
        TestUtils.loadTestData(done);
    });

    describe("function that we are testing", function () {
        it("how we are testing it", function (done) {
            async.waterfall([
                function (callback) {

                    //DAO function here
                    //SomeDAO.doSomething(info, callback)
                }
            ], function (err, retVal) {

                //Assertions here

                done();
            });

        });

        //More test cases as necessary

    });

    //More function tests as necessary
});