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
            function ($routeProvider, $locationProvider) {

                $routeProvider
                
                    // When at root page
                    .when('/projects', {
                        templateUrl : '/app/flexibox-home/template/home.html',
                        controller  : 'FlexiBox.home.homeController'
                    })

                    // When specified projectId (/<project_id>)
                    .when('/projects/:projectId', {
                        templateUrl : '/app/flexibox-project/template/project.html',
                        controller  : 'FlexiBox.project.projectController'
                    })

                    // When specified projectId and setId (/<project_id>/<set_id>)
                    .when('/projects/:projectId/:setId', {
                        templateUrl : '/app/flexibox-set/template/set.html',
                        controller  : 'FlexiBox.set.setController'
                    })

                    // When specified projectId and setId and postId (/<project_id>/<set_id>/<post_id>)
                    .when('/projects/:projectId/:setId/:postId', {
                        templateUrl : '/app/flexibox-post/template/post.html',
                        controller  : 'FlexiBox.post.postController'
                    })

                    // When specified at login page
                    .when('/login', {
                        templateUrl : '/app/flexibox-login/template/login.html',
                        controller  : 'FlexiBox.login.loginController'
                    })
                    // When specified at signup page
                    .when('/signup', {
                        templateUrl : '/app/flexibox-signup/template/signup.html',
                        controller  : 'FlexiBox.signup.signupController'
                    })
                    // When url is undefined
                    .otherwise({
                        redirectTo: '/login'
                    });
                $locationProvider.html5Mode(true);
            }
        ]);
    });