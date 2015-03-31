var Utils = require('../../testingUtils');

var frisby = require('frisby');

var URL = Utils.URL;

//Project ID
var PID = "54d82057b46e200418000006";

//Set ID
var SID = "54d82082b46e200418000007";

//Post ID
var OID = "54d8209cb46e200418000008";

//Comment ID
var CID = "54d820b5b46e200418000009";

//Login as a user with specific rights.
frisby.create("Logging in...")
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
        describe('User Route tests', function () {
            //load test data before each frisby test.
            beforeEach(function (done) {
                Utils.loadTestData(done);
            });

            frisby.create('GET : api/users/projects/pid')
                .delete(URL + 'api/users/projects/' + PID)
                .expectStatus(200)
                .expectJSON({"projects":["54d82057b46e200418000007"]})
                .toss();

            frisby.create('GET : api/users/search/:search_str')
                .get(URL + 'api/users/search/ad')
                .expectStatus(200)
                .expectJSON([{
                    "_id": "54de16c6adad5ff417000005",
                    "name": "admin",
                    "email": "admin@test.com"
                }])
                .toss();

        });
    })
    .toss();