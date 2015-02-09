require('../../../server');
var frisby = require('frisby');
var Utils = require('../../testingUtils');

var URL = "http://localhost:8080/";
var PID = "54d82057b46e200418000006";
var SID = "54d82082b46e200418000007";
var OID = "54d8209cb46e200418000008";

Utils.loadTestData();

frisby.create("postRoutes")
    .post("http://localhost:8080/api/login",
    {
        email: "commenter@test.com",
        password: "commenter"
    }).after(function(body, res){
        var cookie = res.headers['set-cookie'][0].split(';')[0];

        frisby.create("GET : api/project/pid/sets/sid/post/id?includeComments=1")
            .addHeader('Cookie', cookie)
            .get(URL + "api/projects/" + PID + "/sets/" + SID + "/posts/" + OID + "?includeComments=1")
            .expectStatus(200)
            .expectJSON({
                name : "Nolan's Schedule",
                description : "This is Nolan's Schedule",
                imageURL : "uploads\\c0c74226fdae8f0a66b4b207d3134625.PNG",
                "comments":
                    [{
                        "posterName":"commenter",
                        "txt":"Work here",
                        "width":85,
                        "height":41,
                        "color":"rgb(145,127,127)",
                        "number":1,
                        "_id":"54d820b5b46e200418000009",
                        "replies":[{
                            "posterName":"commenter",
                            "txt":"No, that should be gym",
                            "_id":"54d820ceb46e20041800000b"
                        }],
                        "smallest":{
                            "x":505,
                            "y":108
                        }},{
                        "posterName":"commenter",
                        "txt":"Gym here",
                        "width":78,
                        "height":39,
                        "color":"rgb(177,150,109)",
                        "number":2,
                        "_id":"54d820c6b46e20041800000a",
                        "replies":[],
                        "smallest":{
                            "x":295,
                            "y":106
                        }}]
            })
            .toss();
    }).toss();