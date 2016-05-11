/*global module, require */

var config = require('./lib/config');

module.exports = function (grunt) {

    'use strict';

    var server = require('./lib/server')(grunt);

    grunt.registerTask('server:create_key', 'create key', function(args) {

        var done = this.async();

        server.createKey()
        .then(function(){
            done();
        })
        .catch(function(){
            grunt.log.error('something went wrong');
            done(false);
        });

    });

    grunt.registerTask('server:add_key', 'add key to local config', function(args) {

        var done = this.async();

        server.addKeyToConfLocal()
        .then(function(){
            done();
        })
        .catch(function(){
            grunt.log.error('something went wrong');
            done(false);
        });

    });

    grunt.registerTask('server:nameserver', 'set nameserver', function() {

        var done = this.async();

        var set = grunt.option('set');

        if (undefined === set){
            grunt.log.error('use --set');
            done(false);
            return;
        }

        config.setNameServer(set);

    });

    grunt.registerTask('server:domain', 'add/remove zone', function() {

        var done = this.async();

        var add = grunt.option('add');
        var remove = grunt.option('remove');

        if (undefined === add && undefined === remove){
            grunt.log.error('use --add or --remove');
            done(false);
            return;
        }

        if (undefined !== add){
            config.addZone(add);
        }

        if (undefined !== remove){
            config.removeZone(remove);
        }

    });

    grunt.registerTask('server:init', 'complete first setup', function() {

        var done = this.async();

        var nameServer = grunt.option('ns');
        var domains = grunt.option('domain').split(',');

        if (undefined === nameServer || undefined === domains){
            grunt.log.error('use --ns and --domain');
            done(false);
            return;
        }

        config.getZones().forEach(function(domain){
            config.removeZone(domain);
        });

        config.setNameServer(nameServer);

        domains.forEach(function(domain){
            config.addZone(domain);
        });

        server.firstSetup(nameServer, domains)
        .then(function(){
            done();
        });

    });

};



