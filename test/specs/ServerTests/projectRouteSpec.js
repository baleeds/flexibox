var frisby = require('frisby');
var Utils = require('../../testingUtils');
var ProjectDAO = require('../../../server/dao/projectDAO');

var projectData = require('../../data/projects.json');

var URL = Utils.URL;
var PID = '54d82057b46e200418000006';
var SID = '54d82082b46e200418000007';
var OID = '54d8209cb46e200418000008';

frisby.create('Commenter Project Tests')
    .post(URL + 'api/login',
    {
        email: 'commenter@test.com',
        password: 'commenter'
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

        describe('projectRoute Tests', function () {
            beforeEach(function (done) {
                Utils.loadTestData(done);
            });

            frisby.create('GET : api/projects')
                .get(URL + 'api/projects')
                .expectStatus(200)
                .expectJSON([{
                    '_id': '54d82057b46e200418000006',
                    'description': 'This is a shared project.',
                    'name': 'A shared project',
                    'tags': []
                }])
                .toss();
        });
    })
    .toss();

frisby.create('Owner Project Tests')
    .post(URL + 'api/login',
    {
        email: 'owner@test.com',
        password: 'owner'
    }).after(function (body, res) {
        var cookie = res.headers['set-cookie'][0].split(';')[0];
        frisby.globalSetup({ // globalSetup is for ALL requests
            request: {
                headers: {'Cookie': cookie}
            },
            timeout: 5 * 1000
        });

        describe('projectRoute Tests', function () {
            beforeEach(function (done) {
                Utils.loadTestData(done);
            });

            /**
             * Tests getting all projects for an owner.
             */
            frisby.create('GET : api/projects')
                .addHeader('Cookie', cookie)
                .get(URL + 'api/projects')
                .expectStatus(200)
                .expectJSON([{
                    '_id': '54d82057b46e200418000006',
                    'description': 'This is a shared project.',
                    'name': 'A shared project',
                    'tags': []
                }, {
                    '_id': '54d82057b46e200418000007',
                    'tags': []
                }])
                .toss();

            /**
             * Tests making a new project.
             */
            var newProject =
            {
                'name' : 'My new project',
                'description' : 'This is created by frisby',
                'tags' : [{'text': 'hi'}, {'text': 'there'}],
                'commenters' : [
                    {
                        'name': 'commenter',
                        'email': 'commenter@test.com',
                        '_id' : '54d81fffb46e200418000005'
                    }]
            };
            var expect = [];
            for(var i = 0; i < projectData.length; i++) expect.push({});
            expect.push(newProject);
            frisby.create('POST : api/projects')
                .addHeader('Cookie', cookie)
                .post(URL + 'api/projects', newProject)
                .expectStatus(200)
                .expectJSON(expect)
                .toss();


            frisby.create('GET : api/projects/project_id')
                .get(URL + 'api/projects/' + PID)
                .expectStatus(200)
                .expectJSON({
                    '_id': '54d82057b46e200418000006',
                    'description': 'This is a shared project.',
                    'name': 'A shared project',
                    'tags': []
                })
                .toss();

            frisby.create('GET : api/projects/project_id?includeSets=1')
                .get(URL + 'api/projects/' + PID + '?includeSets=1')
                .expectStatus(200)
                .expectJSON({
                    '_id': '54d82057b46e200418000006',
                    'description': 'This is a shared project.',
                    'name': 'A shared project',
                    'sets': [{
                        '_id' : SID,
                        'name': 'DB Flexibox Set',
                        'description': 'A set containing flexibox stuff.',
                        'tags': []
                    }]
                })
                .toss();

            frisby.create('PUT : api/projects/project_id')
                .put(URL + 'api/projects/' + PID,
                {
                    'name': 'This is shared right?',
                    'description' : 'Yeah, it should be',
                    'commenters' : [{
                        'name': 'commenter',
                        'email': 'commenter@test.com',
                        '_id' : '54d81fffb46e200418000005'
                    }],
                    'tags': [{'text': 'shared'}]
                })
                .expectStatus(200)
                .expectJSON({
                    '_id': '54d82057b46e200418000006',
                    'name': 'This is shared right?',
                    'description': 'Yeah, it should be',
                    'commenters' : [{
                        'name': 'commenter',
                        'email': 'commenter@test.com',
                        '_id' : '54d81fffb46e200418000005'
                    }],
                    'tags': [{'text': 'shared'}]
                })
                .toss();


            frisby.create('DELETE : api/projects/project_id')
                .delete(URL + 'api/projects/' + PID)
                .expectStatus(200)
                .expectJSON([{
                    "_id": "54d82057b46e200418000007",
                    "description": "This is a hidden project.",
                    "name": "A hidden project",
                    "tags": [],
                    "commenters": []
                }])
                .toss();
        })
    }).toss();