/*global module, require, process */

'use strict';

module.exports = function(grunt) {

    require('time-grunt')(grunt);

    require('load-grunt-tasks')(grunt, {pattern: [
        'grunt-*',
        '@*/grunt-*',
        'gruntify-eslint*'
    ]});

    require('load-grunt-config')(grunt);

};
