var frisby = require('frisby');
var Utils = require('../../testingUtils');

var URL = "http://localhost:8080/";
var PID = "54d82057b46e200418000006";
var SID = "54d82082b46e200418000007";

Utils.loadTestData();

frisby.create("setRoutes")
    .post(URL + "api/login",
    {
        email: "commenter@test.com",
        password: "commenter"
    }).after(function (body, res) {
        var cookie = res.headers['set-cookie'][0].split(';')[0];

        frisby.create("GET : api/project/pid/sets")
            .addHeader('Cookie', cookie)
            .get(URL + "api/projects/" + PID + "/sets")
            .expectStatus(200)
            .expectJSON([{
                "name": "DB Flexibox Set",
                "description": "A set containing flexibox stuff.",
                "entryURL": "/api/projects54d82057b46e200418000006/sets/undefined",
                "postsURL": "/api/projects54d82057b46e200418000006/sets/undefined/posts",
                "_id": "54d82082b46e200418000007"
            }])
            .toss();

        frisby.create("POST : api/project/pid/sets")
            .addHeader('Cookie', cookie)
            .post(URL + "api/projects/" + PID + "/sets", {
                name: "AMERICA",
                description : "AMERICA IS THE GREATEST COUNTRY EVER!!!!"
            })
            .expectStatus(200)
            .expectJSON({sets : [{
                "name": "DB Flexibox Set",
                "description": "A set containing flexibox stuff."
            }, {
                name: "AMERICA",
                description : "AMERICA IS THE GREATEST COUNTRY EVER!!!!"
            }]})
            .toss();

    }).toss();
