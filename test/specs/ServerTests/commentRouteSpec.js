var Utils = require('../../testingUtils');

var frisby = require('frisby');
var async = require('async');

var URL = Utils.URL;
var PID = "54d82057b46e200418000006";
var SID = "54d82082b46e200418000007";
var OID = "54d8209cb46e200418000008";
var CID = "54d820b5b46e200418000009";


frisby.create("Logging in as an owner.")
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
        describe("commentRouteSpec", function () {
            beforeEach(function (done) {
                Utils.loadTestData(done);
            });

            frisby.create("POST : api/project/pid/sets/sid/post/id")
                .post(URL + "api/projects/" + PID + "/sets/" + SID + "/posts/" + OID + "/comments", {
                    "posterName": "commenter",
                    "txt": "Adding a comment",
                    "width": 10,
                    "height": 10,
                    "color": "rgb(101,167,187)",
                    "number": 2,
                    "smallest": {
                        "x": 0,
                        "y": 8
                    }
                })
                .expectStatus(200)
                .expectJSON({
                    name: "Nolan's Schedule",
                    description: "This is Nolan's Schedule",
                    imageURL: "uploads\\c0c74226fdae8f0a66b4b207d3134625.PNG",
                    "comments": [{}, {}, {
                        "posterName": "commenter",
                        "txt": "Adding a comment",
                        "width": 10,
                        "height": 10,
                        "color": "rgb(101,167,187)",
                        "number": 2,
                        "smallest": {
                            "x": 0,
                            "y": 8
                        }
                    }]
                })
                .toss();

            frisby.create("Delete : api/project/pid/sets/sid/post/id/comments/cid")
                .delete(URL + "api/projects/" + PID + "/sets/" + SID + "/posts/" + OID + "/comments/" + CID)
                .expectStatus(200)
                .expectJSON({
                    _id: SID
                })
                .toss();
        });
    })
    .toss();

