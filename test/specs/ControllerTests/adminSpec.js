/**
 * Created by dfperry on 2/9/2015.
 */
define(
    ["namespace", "flexibox-admin/namespace", "flexibox-admin/module.require", "common/module.require"],
    function(namespace, ctrlNamespace) {

        var name = ctrlNamespace + ".adminController";

        describe(name, function () {

            var $controller;
            var $httpBackend;

            beforeEach(function () {
                module(namespace);

                inject(function ($injector) {
                    $controller = $injector.get("$controller");
                    $httpBackend = $injector.get("$httpBackend");
                });


            });
            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            describe("Admin Controller Tests", function () {
                it("Test UpdateRoles Function", function () {
                    var $scope = {};
                    $controller(name, {$scope : $scope});

                    $scope.userList =[  {"_id": 1, "name": "Dylan", "role": "System Admin"},
                                        {"_id": 2, "name": "Andie", "role": "System Admin"},
                                        {"_id": 3, "name": "Ben", "role": "Project Owner"},
                                        {"_id": 4, "name": "Nolan", "role": "Commenter"}
                                    ];
                    $scope.userModels = [   {"value": "Commenter"},
                                            {"value": "System Admin"},
                                            {"value": "Commenter"},
                                            {"value": "Project Owner"}
                                        ];
                    var passedData =[   {"_id": 1, "name": "Dylan", "role": "Commenter"},
                                        {"_id": 3, "name": "Ben", "role": "Commenter"},
                                        {"_id": 4, "name": "Nolan", "role": "Project Owner"}
                                    ];
                    $httpBackend.expectGET('/api/users').respond(200, true);
                    $httpBackend.whenPOST('/api/users/updateRoles',
                        function (postData) {
                            postData = JSON.parse(postData);
                            expect(postData.length).toEqual(passedData.length);
                            for(var i=0; i<postData.length; i++){
                                expect(postData[i].id).toEqual(passedData[i]._id);
                                expect(postData[i].name).toEqual(passedData[i].name);
                                expect(postData[i].role).toEqual(passedData[i].role);
                            }
                            return true;
                        }).respond(200, true);

                    $scope.updateRoles();
                    $httpBackend.flush();

                });
            })
        })
    }
);
