// ------------------------------------------------------------
// Sets routes for changing the view and assigning controllers.
// Our page never changes.  The view is changed.
//-------------------------------------------------------------
define([
        'angular',
        './app',
        './namespace'
    ],
    function (angular, app, namespace) {
        'use strict';

        return app.config([
            '$routeProvider',
            '$locationProvider',
            '$httpProvider',
            function ($routeProvider, $locationProvider, $httpProvider) {

                $routeProvider
                
                    // When at root page
                    .when(ROOT + '/projects', {
                        templateUrl : '/app/flexibox-home/template/home.html',
                        controller  : 'FlexiBox.home.homeController'
                    })

                    // When specified projectId (/<project_id>)
                    .when(ROOT + '/projects/:projectId', {
                        templateUrl : '/app/flexibox-project/template/project.html',
                        controller  : 'FlexiBox.project.projectController'
                    })

                    // When specified projectId and setId (/<project_id>/<set_id>)
                    .when(ROOT + '/projects/:projectId/:setId', {
                        templateUrl : '/app/flexibox-set/template/set.html',
                        controller  : 'FlexiBox.set.setController'
                    })

                    // When specified projectId and setId and postId (/<project_id>/<set_id>/<post_id>)
                    .when(ROOT + '/projects/:projectId/:setId/:postId', {
                        templateUrl : '/app/flexibox-post/template/post.html',
                        controller  : 'FlexiBox.post.postController',
                        css : '/styles/post.css'
                    })

                    // When specified at login page
                    .when(ROOT + '/login', {
                        templateUrl : '/app/flexibox-login/template/login.html',
                        controller  : 'FlexiBox.login.loginController'
                    })
                    // When specified at signup page
                    .when(ROOT + '/signup', {
                        templateUrl : '/app/flexibox-signup/template/signup.html',
                        controller  : 'FlexiBox.signup.signupController'
                    })
                    .when(ROOT + '/admin', {
                        templateUrl : '/app/flexibox-admin/template/admin.html',
                        controller  : 'FlexiBox.admin.adminController'
                    })
                    // When url is undefined
                    .otherwise({
                        redirectTo: ROOT + '/login'
                    });
                $locationProvider.html5Mode(true);

                //
                $httpProvider.interceptors.push(['$q', '$location', function($q, $location){
                        return {
                            'request' : function(config){
                                config.url = ROOT + config.url;
                                return config;
                                return config;
                            },

                            'requestError' : function(rejection){
                                return $q.reject(rejection);
                            },
                            'response' : function(config){
                                return config;
                            },

                            'responseError' : function(rejection){
                                if(rejection.status == 401) {
                                    $location.path(ROOT + "/login");
                                    return $q.reject(rejection);
                                }
                                else if(rejection.status == 402){
                                    $location.path(ROOT + "/projects");
                                    return $q.reject(rejection);
                                }
                                return $q.reject(rejection);
                            }
                        }
                    }]
                )
            }
        ]);
    });