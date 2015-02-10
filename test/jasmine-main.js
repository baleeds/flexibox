/**
 * Created by dfperry on 1/21/2015.
 */
// ------------------------------------------------------------
// Manages dependencies using requirejs.  Bootstraps Angular to document.
//-------------------------------------------------------------
require.config({
    waitSeconds: 1000,
    baseUrl: "../app",
    paths: {
        "angular": "../dependencies/js/angular/angular.min",
        "angularRoute": "../dependencies/js/angular_route/angular-route.min",
        "angularSanitize": "../dependencies/js/angular_sanitize/angular-sanitize.min",
        "angularMocks": "../dependencies/js/angular_mocks/angular-mocks",
        "bootstrap": "../dependencies/js/openstyle/bootstrap",
        "jquery": "../dependencies/js/jquery/jquery",
        "modernizr": "../dependencies/js/modernizr/modernizr",
        "specs": "../test/specs"
    },
    /** This error comes from the fact that it cannot find the specs file, relative to this file. However, by using a
     * different base url, this problem it is resolved
     * - Dylan Perry (Dfperry2@ncsu.edu)
     * **/
    shim: {
        angular: {
            exports: "angular"
        },
        angularRoute: {
            deps: ["angular"]
        },
        angularSanitize: {
            deps: ["angular"]
        },
        angularMocks: {
            deps: ["angular"]
        },
        bootstrap: {
            deps: ["jquery"],
            exports: "bootstrap"
        },
        jquery: {
            exports: "jquery"
        },
        modernizr: {
            exports: "modernizr"
        }
    }
});

require([
        "angular",
        "specs/ControllerTests/sessionSpec",
        "specs/ControllerTests/signupSpec",
        "specs/ControllerTests/postSpec",
        "specs/ControllerTests/adminSpec",

        "specs/FactoryTests/utilityFactorySpec",
        "specs/FactoryTests/homeFactorySpec",
        "specs/FactoryTests/projectFactorySpec",
        "specs/FactoryTests/setFactorySpec",
        "specs/FactoryTests/postFactorySpec",
        "specs/FactoryTests/sessionFactorySpec",
        "specs/FactoryTests/adminFactorySpec",

        "routes",
        "angularMocks"
    ],
    function (angular, namespace) {
        Foundation.global.namespace = "";
        jasmine.getEnv().execute();
    });
