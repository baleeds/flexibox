var allTestFiles = [];
var TEST_REGEXP = /(Spec|Test)\.js$/i;
var ROOT = '';

var pathToModule = function(path) {
  return path.replace(/^\/base\/test\/specs\//, 'specs/').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base/app',
    paths: {
        "angular": "/base/dependencies/js/angular/angular.min",
        "angularRoute": "/base/dependencies/js/angular-route/angular-route.min",
        "angularRouteStyles": "/base/dependencies/js/angular-route-styles/route-styles",
        "angularSanitize": "/base/dependencies/js/angular-sanitize/angular-sanitize.min",
        "angularMocks": "/base/dependencies/js/angular-mocks/angular-mocks",
        "bootstrap": "/base/dependencies/js/openstyle/bootstrap",
        "jquery": "/base/dependencies/js/jquery/jquery",
        "jqueryUI": "/base/dependencies/js/jquery-ui/jquery-ui.min",
        "specs": "/base/test/specs"
    },

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
    },

  // dynamically load all test files
  deps: ["angular", "routes", "angularMocks"].concat(allTestFiles),

  // we have to kickoff jasmine, as it is asynchronous
  callback: function(){
      window.__karma__.start();
  }
});
