var frisby = require('frisby');
var Utils = require('../../testingUtils');

var async = require('async');

var URL = Utils.URL;
var PID = "54d82057b46e200418000006";
var SID = "54d82082b46e200418000007";
var OID = "54d8209cb46e200418000008";

frisby.create("Commenter Project Tests")
    .post(URL + "api/login",
    {
        email: "commenter@test.com",
        password: "commenter"
    }, {followRedirect: false})
    .expectStatus(302)
    .after(function (body, res) {
        var cookie = res.headers['set-cookie'][0].split(';')[0];
        frisby.globalSetup({ // globalSetup is for ALL requests
            request: {
                headers: {'Cookie': cookie}
            },
            timeout: Utils.TIMEOUT
        });

        describe("projectRoute Tests", function () {
            beforeEach(function (done) {
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
        });
    })
    .toss();

frisby.create("Owner Project Tests")
    .post(URL + "api/login",
    {
        email: "owner@test.com",
        password: "owner"
    }).after(function (body, res) {
        var cookie = res.headers['set-cookie'][0].split(';')[0];
        frisby.globalSetup({ // globalSetup is for ALL requests
            request: {
                headers: {'Cookie': cookie}
            },
            timeout: 5 * 1000
        });

        describe("projectRoute Tests", function () {
            beforeEach(function (done) {
                Utils.loadTestData(done);
            });

            /**
             * Tests getting all projects for an owner.
             */
            frisby.create("GET : api/projects")
                .addHeader('Cookie', cookie)
                .get(URL + "api/projects")
                .expectStatus(200)
                .expectJSON([{
                    "_id": "54d82057b46e200418000006",
                    "description": "This is a shared project.",
                    "name": "A shared project",
                    "tags": []
                }, {
                    "_id": "54d82057b46e200418000007",
                    "tags": []
                }])
                .toss();
        })
    }).toss();