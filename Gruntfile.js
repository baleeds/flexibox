"use strict"

module.exports = function (grunt) {

    // Set up basic config for requirejs, include config that is common to all the requirejs.optimize() calls.
    var baseConfig = {
        baseUrl: "./app",
        locale: "en-us",

        paths: {
            // Gotcha: paths will be relative to the baseUrl defined above.
            // Non-bower dependencies should be stored in "vendor" dir.

            "angular": "../dependencies/js/angular/angular.min",
            "jquery": "../dependencies/js/jquery/jquery",
            "angularRoute": "../dependencies/js/angular-route/angular-route.min",
            "angularRouteStyles": "../dependencies/js/angular-route-styles/route-styles",
            "angularSanitize": "../dependencies/js/angular-sanitize/angular-sanitize.min",
            "bootstrap": "../dependencies/js/openstyle/bootstrap",

            "FlexiBox": "../<%=pkg.name%>"
        }
    };

    // Function used to mix in baseConfig to a new config target
    function mix(target) {
        for (var prop in baseConfig) {
            if (baseConfig.hasOwnProperty(prop)) {
                target[prop] = baseConfig[prop];
            }
        }
        return target;
    }

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        dirs: {
            output: "dist",
            jsOutput: "dist/js",
            dependencies: "dependencies"
        },
        bower: {
            // Download dependencies and copy relevant files to dependencies folder (see bower.json)
            // Gotcha: bower.json must reference direct http url's to github to bypass firewall issues with git url's
            install: {
                options: {
                    targetDir: "<%=dirs.dependencies%>",
                    verbose: true // Enable logging
                }
            }
        },
        requirejs: {
            // Generate combined files.  Let requirejs load dependencies as needed
            compile: {
                // Version with no third party dependencies
                options: mix({
                    optimize: "none",
                    include: ["main"],
                    exclude: ["angular"],
                    out: "<%=dirs.jsOutput%>/<%=pkg.name%>.js"
                })
            },
            compile_min: {
                // Minified version with no third party dependencies
                options: mix({
                    optimize: "uglify2",
                    include: ["main"],
                    exclude: ["angular"],
                    out: "<%=dirs.jsOutput%>/<%=pkg.name%>.min.js"
                })
            },
            compile_full: {
                // Version with third party dependencies
                options: mix({
                    optimize: "none",
                    include: ["../<%=dirs.jsOutput%>/<%=pkg.name%>"], // Use built component file
                    exclude: [],
                    out: "<%=dirs.jsOutput%>/<%=pkg.name%>.full.js"
                })
            },
            compile_full_min: {
                // Minified version with third party dependencies
                options: mix({
                    optimize: "uglify2",
                    include: ["../<%=dirs.jsOutput%>/<%=pkg.name%>.min"], // Use built component file
                    exclude: [],
                    out: "<%=dirs.jsOutput%>/<%=pkg.name%>.full.min.js"
                })
            }
        },
        clean: {
            build: ["<%=dirs.output%>/*", "!<%=dirs.output%>/index.html", "<%=dirs.dependencies%>"]
        },
        copy: {
            requirejs: {
                src: "<%=dirs.dependencies%>/js/requirejs/require.js",
                dest: "<%= dirs.jsOutput %>/",
                expand: true,
                flatten: true
            },
            angular: {
                src: "vendor/js/angular/angular-1.2.9.js",
                dest: "<%= dirs.jsOutput %>/",
                expand: true,
                flatten: true
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        jasmine_node: {
            task_name: {
                options: {
                    coverage: {
                        print: 'summary', // none, summary, detail, both
                        relativize: true,
                        thresholds: {
                            statements: 0,
                            branches: 0,
                            lines: 0,
                            functions: 0
                        },
                        reportDir: 'reports/coverage',
                        report: [
                            'cobertura'
                        ],
                        collect: false,
                        excludes: []
                    },
                    forceExit: false,
                    match: '.',
                    matchAll: false,
                    specFolders: ['test/specs/ServerTests'],
                    extensions: 'js',
                    specNameMatcher: 'spec',
                    captureExceptions: true,
                    junitreport: {
                        report: true,
                        savePath: 'reports/results/',
                        useDotNotation: true,
                        consolidate: true
                    }
                },
                src: ['server.js', 'server/**/*.js']
            }
        }
    });

    // Enable logging
    grunt.log.writeflags(grunt.config.get("requirejs.compile"), "Compile config:");
    grunt.log.writeflags(grunt.config.get("requirejs.compile_min"), "Compile min config:");
    grunt.log.writeflags(grunt.config.get("requirejs.compile_full"), "Compile full config:");
    grunt.log.writeflags(grunt.config.get("requirejs.compile_full_min"), "Compile full min config:");

    grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks("grunt-requirejs");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-jasmine-node-coverage");
    grunt.loadNpmTasks("grunt-karma");

    // Default task
    grunt.registerTask("default", ["bower", "requirejs", "copy"]);

    // Development task
    grunt.registerTask("development", ["clean", "bower", "requirejs:compile", "requirejs:compile_full"]);

    // Production task
    grunt.registerTask("production", ["clean", "bower", "requirejs:compile_min", "requirejs:compile_full_min", "copy"]);

    //Testing
    grunt.registerTask("test", ["karma", "jasmine_node"]);

};