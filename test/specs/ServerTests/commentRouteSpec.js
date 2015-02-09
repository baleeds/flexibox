var frisby = require('frisby');
var Utils = require('../../testingUtils');

var URL = "http://localhost:8080/";
var PID = "54d82057b46e200418000006";
var SID = "54d82082b46e200418000007";
var OID = "54d8209cb46e200418000008";

Utils.loadTestData();

frisby.create("commentRoutes")
    .post("http://localhost:8080/api/login",
    {
        email: "commenter@test.com",
        password: "commenter"
    }).after(function(body, res){
        var cookie = res.headers['set-cookie'][0].split(';')[0];

        frisby.create("POST : api/project/pid/sets/sid/post/id")
            .addHeader('Cookie', cookie)
            .post(URL + "api/projects/" + PID + "/sets/" + SID + "/posts/" + OID + "/comments",{
                "posterName":"commenter",
                "txt":"Adding a comment",
                "width":10,
                "height":10,
                "color":"rgb(101,167,187)",
                "number":2,
                "smallest":{
                    "x":0,
                    "y":8
                }
            })
            .expectStatus(200)
            .expectJSON({
                name : "Nolan's Schedule",
                description : "This is Nolan's Schedule",
                imageURL : "uploads\\c0c74226fdae8f0a66b4b207d3134625.PNG",
                "comments":
                    [{ },{ },{
                        "posterName":"commenter",
                        "txt":"Adding a comment",
                        "width":10,
                        "height":10,
                        "color":"rgb(101,167,187)",
                        "number":2,
                        "smallest":{
                            "x":0,
                            "y":8
                        }}]
            })
            .toss();
    }).toss();