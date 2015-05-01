// ------------------------------------------------------------
// Manages dependencies using requirejs.  Bootstraps Angular to document.
//-------------------------------------------------------------

//Run with no root since I am too lazy to change all the httpBackend expects to have ROOT + ....
var ROOT = '';
require.config({
    waitSeconds: 1000,
    baseUrl: "../min",
    paths: {
        "angular": "../dependencies/js/angular/angular.min",
        "angularRoute": "../dependencies/js/angular-route/angular-route.min",
        "angularRouteStyles": "../dependencies/js/angular-route-styles/route-styles",
        "angularSanitize": "../dependencies/js/angular-sanitize/angular-sanitize.min",
        "angularMocks": "../dependencies/js/angular-mocks/angular-mocks",
        "bootstrap": "../dependencies/js/openstyle/bootstrap",
        "jquery": "../dependencies/js/jquery/jquery",
        "jqueryUI": "../dependencies/js/jquery-ui/jquery-ui.min",
        "specs": "../test/specs",
        "boot" : "../dependencies/js/jasmine-core/boot"
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
        angularRouteStyles: {
            deps: ["angularRoute"]
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
        jqueryUI: {
            deps: ["jquery"],
            exports: "jqueryUI"
        }
    }
});

require([
        "angular",
        "specs/ControllerTests/sessionSpec",
        "specs/ControllerTests/signupSpec",
        "specs/ControllerTests/postSpec",
        "specs/ControllerTests/adminSpec",
        "specs/ControllerTests/setControllerSpec",
        "specs/ControllerTests/projectControllerSpec",
        "specs/ControllerTests/homeControllerSpec",
        "specs/ControllerTests/homeSpec",
        "specs/ControllerTests/loginControllerSpec",

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
        $(".alert").html("");
        jasmine.getEnv().execute();
    });
