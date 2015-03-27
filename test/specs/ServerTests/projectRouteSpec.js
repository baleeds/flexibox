var frisby = require('frisby');
var Utils = require('../../testingUtils');

var async = require('async');

var URL = Utils.URL;
var PID = "54d82057b46e200418000006";
var SID = "54d82082b46e200418000007";
var OID = "54d8209cb46e200418000008";

async.waterfall([
    function(callback) {
        frisby.create("logging in")
            .post(URL + "api/login",
            {
                email: "commenter@test.com",
                password: "commenter"
            },{followRedirect: false})
            .expectStatus(302)
            .after(function (body, res) {
                var cookie = res.headers['set-cookie'][0].split(';')[0];
                frisby.globalSetup({ // globalSetup is for ALL requests
                    request: {
                        headers: {'Cookie': cookie}
                    },
                    timeout: 10 * 1000
                });
                console.log(cookie);

                callback(null);
            }).toss();
    }],
    function(err){
        describe("projectRoute Tests", function(){
            beforeEach(function(done){
                Utils.loadTestData(done);
            });


            frisby.create("GET : api/projects")
                .get(URL + "api/projects")
                .expectStatus(200)
                .expectJSON([{
                    "_id": "54d82057b46e200418000006",
                    "description": "This is a shared project.",
                    "name": "A shared project",
                    "tags": []
                }])
                .toss();

        })

    });
//
//describe("postRouteTests", function(){})
//    })
//
//    .post(URL + "api/login",
//    {
//        email: "owner@test.com",
//        password: "owner"
//    }).after(function (body, res) {
//        var cookie = res.headers['set-cookie'][0].split(';')[0];
//
//        Utils.loadTestData();
//
//        /**
//         * Tests getting all projects for an owner.
//         */
//        frisby.create("GET : api/projects")
//            .addHeader('Cookie', cookie)
//            .get(URL + "api/projects")
//            .expectStatus(200)
//            .expectJSON([{
//                "_id": "54d82057b46e200418000006",
//                "description": "This is a shared project.",
//                "name": "A shared project",
//                "tags": []
//            }, {
//                "_id": "54d82057b46e200418000007",
//                "description": "This is a hidden project.",
//                "name": "A hidden project",
//                "tags": []
//            }])
//            .toss();
//    }).toss();