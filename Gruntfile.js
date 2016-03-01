/*global module, require, process */

module.exports = function(grunt) {
    "use strict";

    require('load-grunt-tasks')(grunt);

    var path = require('path');
    require('load-grunt-config')(grunt,{
        configPath:path.join(process.cwd(), 'grunt')
    });

    grunt.registerTask('test', 'Build autoload file and run tests.', function(testFilter) {
        grunt.task.run('autoload');
        if (!grunt.option('lite')) {
            grunt.task.run('clean:coverage');
        }
        if (testFilter === undefined) {
            grunt.task.run('exec:phpunit');
        }
        else {
            grunt.task.run('exec:phpunit:' + testFilter);
        }
    });
};
