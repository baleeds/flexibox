var frisby = require('frisby');
var Utils = require('../../testingUtils');

var URL = Utils.URL;
var PID = "54d82057b46e200418000006";
var SID = "54d82082b46e200418000007";

frisby.create("setRoute Testing")
    .post(URL + "api/login",
    {
        "email": "owner@test.com",
        "password": "owner"
    },
    {followRedirect: true})
    .after(function (body, res) {
        var cookie = res.headers['set-cookie'][0].split(';')[0];
        frisby.globalSetup({
            request: {
                headers: {'Cookie': cookie, 'Connection': 'close'},
                timeout: Utils.TIMEOUT
            }
        });

        describe("setRoute Specs begin here", function() {

            beforeEach(function (done) {
                Utils.loadTestData(done);
            });

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
                    description: "AMERICA IS THE GREATEST COUNTRY EVER!!!!"
                })
                .expectStatus(200)
                .expectJSON({
                    sets: [{
                        "name": "DB Flexibox Set",
                        "description": "A set containing flexibox stuff."
                    }, {
                        name: "AMERICA",
                        description: "AMERICA IS THE GREATEST COUNTRY EVER!!!!"
                    }]
                })
                .toss();

            frisby.create("GET : api/project/pid/sets/sid?includePosts=true")
                .addHeader('Cookie', cookie)
                .get(URL + "api/projects/" + PID + "/sets/" + SID + "?includePosts=true")
                .expectStatus(200)
                .expectJSON({
                    "name": "DB Flexibox Set",
                    "description": "A set containing flexibox stuff.",
                    "entryURL": "/api/projects54d82057b46e200418000006/sets/undefined",
                    "postsURL": "/api/projects54d82057b46e200418000006/sets/undefined/posts",
                    "posts": [],
                    "_id": "54d82082b46e200418000007"
                })
                .toss();

            frisby.create("GET : api/project/pid/sets/sid")
                .addHeader('Cookie', cookie)
                .get(URL + "api/projects/" + PID + "/sets/" + SID)
                .expectStatus(200)
                .expectJSON({
                    "name": "DB Flexibox Set",
                    "description": "A set containing flexibox stuff.",
                    "entryURL": "/api/projects54d82057b46e200418000006/sets/undefined",
                    "postsURL": "/api/projects54d82057b46e200418000006/sets/undefined/posts",
                    "_id": "54d82082b46e200418000007"
                })
                .toss();
        });
    }).toss();
