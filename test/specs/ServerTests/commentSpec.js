var frisby = require('frisby');

var URL = "http://localhost:8080/";
var PID = "54cd03edf35c8f0c1d000004";
var SID = "54cd03f6f35c8f0c1d000005";
var OID = "54cd4bc97a3e43e41d000005";

frisby.create("commentRoutes")
    .post("http://localhost:8080/api/login",
    {
        email: "nolanpiland@gmail.com",
        password: "Nolan"
    }).after(function(body, res){
        var cookie = res.headers['set-cookie'][0].split(';')[0];
        frisby.create("GET : api/project/pid/sets/sid/post/id?includeComments=1")
            .addHeader('Cookie', cookie)
            .get(URL + "api/projects/" + PID + "/sets/" + SID + "/posts/" + OID + "?includeComments=1")
            .expectStatus(200)
            .toss();
    }).toss();