var Utils = require('../../testingUtils');
var UserDAO = require('../../../server/dao/userDAO');

var async = require('async');
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

            frisby.create('GET : api/users/')
                .get(URL + 'api/users/')
                .expectStatus(402)
                .toss();

            frisby.create('GET : api/users/projects/pid')
                .delete(URL + 'api/users/projects/' + PID)
                .expectStatus(200)
                .expectJSON({"projects": ["54d82057b46e200418000007"]})
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

            frisby.create('GET : api/users/current/')
                .get(URL + 'api/users/current/')
                .expectStatus(200)
                .expectJSON({
                    _id: '54de173badad5ff417000006',
                    name: 'owner',
                    __v: 0,
                    local: {
                        password: '$2a$08$cu.alQdIZ0HvrUq4fNYsuuvHTjjOk.gCQaylq4.9MxhYpgEtDyqwu',
                        email: 'owner@test.com'
                    },
                    role: 'Owner',
                    projectsVisible: ['54d82057b46e200418000006',
                        '54d82057b46e200418000007']
                })
                .toss();
            frisby.create('PUT : api/users/current/')
                .put(URL + 'api/users/current/', {
                    name: 'Nolan',
                    imageURL : 'http://www.google.com',
                    emailSettings: '2',
                    projectsVisible: ['54d82057b46e200418000006']
                })
                .expectStatus(200)
                .expectJSON({message: 'User Updated'})
                .after(
                    function() {
                        async.waterfall([
                            function(callback){
                                UserDAO.userSearch('Nolan', callback);
                            }
                        ], function(err, user){
                            user = user[0];
                            expect(user.name).toBe('Nolan');
                            expect(user.imageURL).toBe('http://www.google.com');
                        });
                    }
                )
                .toss();
        });
    })
    .toss();

frisby.create("Admin User Routes")
    .post(URL + "api/login",
    {
        "email": "admin@test.com",
        "password": "admin"
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
        describe("User Route Testing", function () {
            //load test data before each frisby test.
            beforeEach(function (done) {
                Utils.loadTestData(done);
            });

            frisby.create('GET : api/users/')
                .get(URL + 'api/users/')
                .expectStatus(200)
                .expectJSON([{
                    _id: '54d81fffb46e200418000005',
                    name: 'commenter',
                    __v: 0,
                    local: {
                        password: '$2a$08$Y80WxOvh19ya7XXrYYnm2eppZJ2OikRh.S0EZyd7ilE2NsQIJxel6',
                        email: 'commenter@test.com'
                    },
                    role: 'Commenter',
                    projectsVisible: ['54d82057b46e200418000006']
                },
                    {
                        _id: '54de16c6adad5ff417000005',
                        name: 'admin',
                        __v: 0,
                        local: {
                            password: '$2a$08$z9N5MnM5Vz8X5RnTOKlwVuiv2NtXjpi49joiVOWhD6T.BH1xPQSau',
                            email: 'admin@test.com'
                        },
                        role: 'System Admin',
                        projectsVisible: []
                    },
                    {
                        _id: '54de173badad5ff417000006',
                        name: 'owner',
                        __v: 0,
                        local: {
                            password: '$2a$08$cu.alQdIZ0HvrUq4fNYsuuvHTjjOk.gCQaylq4.9MxhYpgEtDyqwu',
                            email: 'owner@test.com'
                        },
                        role: 'Owner',
                        projectsVisible: ['54d82057b46e200418000006',
                            '54d82057b46e200418000007']
                    }])
                .toss();
        });
    })
    .toss();
