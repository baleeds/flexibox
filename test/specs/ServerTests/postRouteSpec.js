require('../../../server');
var frisby = require('frisby');
var Utils = require('../../testingUtils');

var URL = "http://localhost:8080/";
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
         * Tests getting all posts for a specific set. Comments are included.
         */
        frisby.create("GET : api/project/pid/sets/sid/posts?includeComments=1")
            .addHeader('Cookie', cookie)
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
            .addHeader('Cookie', cookie)
            .get(URL + "api/projects/" + PID + "/sets/" + SID + "/posts")
            .expectJSON([{
                "name": "Nolan's Schedule",
                "description": "This is Nolan's Schedule",
                "_id": "54d8209cb46e200418000008"
            }])
            .expectStatus(200)
            .toss();

        Utils.loadTestData();

        /**
         * Testing getting a post with all the comments attached to it.
         */
        frisby.create("GET : api/project/pid/sets/sid/posts/id?includeComments=1")
            .addHeader('Cookie', cookie)
            .get(URL + "api/projects/" + PID + "/sets/" + SID + "/posts/" + OID + "?includeComments=1")
            .expectStatus(200)
            .expectJSON({
                "_id":"54d8209cb46e200418000008",
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
            .addHeader('Cookie', cookie)
            .get(URL + "api/projects/" + PID + "/sets/" + SID + "/posts/" + OID)
            .expectJSON({
                "name": "Nolan's Schedule",
                "description": "This is Nolan's Schedule",
                "imageURL": "uploads\\c0c74226fdae8f0a66b4b207d3134625.PNG",
                "_id": "54d8209cb46e200418000008"
            })
            .expectStatus(200)
            .toss();

        Utils.loadTestData();

        /**
         * Testing updating a post's description and name.
         */
        frisby.create("PUT : api/project/pid/sets/sid/posts/id")
            .addHeader('Cookie', cookie)
            .put(URL + "api/projects/" + PID + "/sets/" + SID + "/posts/" + OID,
            {
                name : "This is my new name!",
                description : "This is my new description."
            })
            .expectJSON({
                name : "This is my new name!",
                description : "This is my new description.",
                "imageURL": "uploads\\c0c74226fdae8f0a66b4b207d3134625.PNG",
                "_id": "54d8209cb46e200418000008"
            })
            .expectStatus(200)
            .toss();

        Utils.loadTestData();

        /**
         * Testing deleting a post.
         */
        frisby.create("DELETE : api/project/pid/sets/sid/posts/id")
            .addHeader('Cookie', cookie)
            .delete(URL + "api/projects/" + PID + "/sets/" + SID + "/posts/" + OID,
            {
                name : "This is my new name!",
                description : "This is my new description."
            })
            .expectJSON({
            })
            .expectStatus(200)
            .toss();
    }).toss();