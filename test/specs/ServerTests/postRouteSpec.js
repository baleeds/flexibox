var frisby = require('frisby');
var Utils = require('../../testingUtils');

var URL = Utils.URL;
var PID = "54d82057b46e200418000006";
var SID = "54d82082b46e200418000007";
var OID = "54d8209cb46e200418000008";

frisby.create("postRoutes Tests")
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

        describe("postRoute Tests", function () {
            beforeEach(function (done) {
                Utils.loadTestData(done);
            });

            /**
             * Tests getting all posts for a specific set. Comments are included.
             */
            frisby.create("GET : api/project/pid/sets/sid/posts?includeComments=1")
                .get(URL + "api/projects/" + PID + "/sets/" + SID + "/posts" + "?includeComments=1")
                .expectStatus(200)
                .expectJSON([{
                    "_id": "54d8209cb46e200418000008",
                    "comments": [{
                        "posterName": "commenter",
                        "txt": "Work here",
                        "width": 85,
                        "height": 41,
                        "color": "rgb(145,127,127)",
                        "number": 1,
                        "_id": "54d820b5b46e200418000009",
                        "replies": [{
                            "posterName": "commenter",
                            "txt": "No, that should be gym",
                            "_id": "54d820ceb46e20041800000b"
                        }],
                        "smallest": {"x": 505, "y": 108}
                    }, {
                        "posterName": "commenter",
                        "txt": "Gym here",
                        "width": 78,
                        "height": 39,
                        "color": "rgb(177,150,109)",
                        "number": 2,
                        "_id": "54d820c6b46e20041800000a",
                        "replies": [],
                        "smallest": {"x": 295, "y": 106}
                    }]
                }])
                .toss();

            /**
             * Tests getting all posts for a set without comment information.
             */
            frisby.create("GET : api/project/pid/sets/sid/posts")
                .get(URL + "api/projects/" + PID + "/sets/" + SID + "/posts")
                .expectJSON([{
                    "name": "Nolan's Schedule",
                    "description": "This is Nolan's Schedule",
                    "_id": "54d8209cb46e200418000008"
                }])
                .expectStatus(200)
                .toss();

            /**
             * Testing getting a post with all the comments attached to it.
             */
            frisby.create("GET : api/project/pid/sets/sid/posts/id?includeComments=1")
                .get(URL + "api/projects/" + PID + "/sets/" + SID + "/posts/" + OID + "?includeComments=1")
                .expectStatus(200)
                .expectJSON({
                    "_id": "54d8209cb46e200418000008",
                    "comments": [{
                        "_id": "54d820b5b46e200418000009",
                        "replies": [{
                            "_id": "54d820ceb46e20041800000b"
                        }],
                        "smallest": {
                            "x": 505,
                            "y": 108
                        }
                    }, {
                        "_id": "54d820c6b46e20041800000a",
                        "replies": [],
                        "smallest": {
                            "x": 295,
                            "y": 106
                        }
                    }]
                })
                .toss();


            /**
             * Testing getting a post with no comment information attached to it.
             */
            frisby.create("GET : api/project/pid/sets/sid/posts/id")
                .get(URL + "api/projects/" + PID + "/sets/" + SID + "/posts/" + OID)
                .expectJSON({
                    "name": "Nolan's Schedule",
                    "description": "This is Nolan's Schedule",
                    "imageURL": "uploads\\c0c74226fdae8f0a66b4b207d3134625.PNG",
                    "_id": "54d8209cb46e200418000008"
                })
                .expectStatus(200)
                .toss();

            /**
             * Testing updating a post's description and name.
             */
            frisby.create("PUT : api/project/pid/sets/sid/posts/id")
                .put(URL + "api/projects/" + PID + "/sets/" + SID + "/posts/" + OID,
                {
                    name: "This is my new name!",
                    description: "This is my new description.",
                    tags: []
                })
                .expectJSON({
                    name: "This is my new name!",
                    description: "This is my new description.",
                    "imageURL": "uploads\\c0c74226fdae8f0a66b4b207d3134625.PNG",
                    "_id": "54d8209cb46e200418000008"
                })
                .expectStatus(200)
                .toss();

            /**
             * Testing deleting a post.
             */
            frisby.create("DELETE : api/project/pid/sets/sid/posts/id")
                .delete(URL + "api/projects/" + PID + "/sets/" + SID + "/posts/" + OID)
                .expectJSON({})
                .expectStatus(200)
                .toss();
        });
    })
    .toss();