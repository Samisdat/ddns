/*global module, require, process */

module.exports = function(grunt) {
    "use strict";

    require('time-grunt')(grunt);
    
    require('load-grunt-tasks')(grunt, {pattern: [
        'grunt-*', 
        '@*/grunt-*',
        'gruntify-eslint*'
    ]});

    require('load-grunt-config')(grunt);

    grunt.initConfig({

        'mocha_istanbul': {
            coverage: {
                src: 'test/**/*.js' // a folder works nicely
            }
        },
        'istanbul_check_coverage': {
            default: {
                options: {
                    coverageFolder: 'coverage/', // will check both coverage folders and merge the coverage results
                    check: {
                        lines: 80,
                        statements: 80
                    }
                }
            }
        }

    });


    grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
};
