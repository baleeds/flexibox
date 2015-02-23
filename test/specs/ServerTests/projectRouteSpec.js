var frisby = require('frisby');
var Utils = require('../../testingUtils');

var URL = Utils.URL;
var PID = "54d82057b46e200418000006";
var SID = "54d82082b46e200418000007";
var OID = "54d8209cb46e200418000008";

Utils.loadTestData();

frisby.create("postRoutes")
    .post(URL + "api/login",
    {
        email: "commenter@test.com",
        password: "commenter"
    }).after(function (body, res) {
        var cookie = res.headers['set-cookie'][0].split(';')[0];

        Utils.loadTestData();

        /**
         * Tests getting my projects for a commenter.
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
            }])
            .toss();
    })

    .post(URL + "api/login",
    {
        email: "owner@test.com",
        password: "owner"
    }).after(function (body, res) {
        var cookie = res.headers['set-cookie'][0].split(';')[0];

        Utils.loadTestData();

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
                "description": "This is a hidden project.",
                "name": "A hidden project",
                "tags": []
            }])
            .toss();
    }).toss();