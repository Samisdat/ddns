/*global module, require */

var config = require('./lib/config');

module.exports = function (grunt) {

    "use strict";

    var server = require('./lib/server')(grunt);

    grunt.registerTask('qserver:create_key', 'help', function(args) {

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

    grunt.registerTask('qserver:add_key', 'help', function(args) {

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

    grunt.registerTask('qserver:setup', 'help', function(args) {
    
        var done = this.async();

        server.firstSetup()
        .then(function(){
            done();
        })
        .catch(function(){
            grunt.log.error('something went wrong');
            done(false);
        });


    });

    grunt.registerTask('qserver:nameserver', 'help', function() {
            
        var done = this.async();

        var set = grunt.option('set');

        if(undefined === set){
            grunt.log.error('use --set');
            done(false);
            return;
        }

        config.setNameServer(set);

    });

    grunt.registerTask('qserver:logging', 'help', function() {
            
        var done = this.async();

        server.enableLogging()
        .then(function(){
            done();
        });

    });    

    grunt.registerTask('qserver:chown', 'help', function() {
            
        var done = this.async();

        server.chownBindDir()
        .then(function(){
            done();
        });

    });

    grunt.registerTask('qserver:domain', 'help', function() {
            
        var done = this.async();

        var add = grunt.option('add');
        var remove = grunt.option('remove');

        if(undefined === add && undefined === remove){
            grunt.log.error('use --add or --remove');
            done(false);
            return;
        }

        if(undefined !== add){
            config.addZone(add);
        }

        if(undefined !== remove){
            config.removeZone(remove);
        }

    });

    grunt.registerTask('qserver:super', 'help', function() {
        
        var done = this.async();        
        
        var nameServer = grunt.option('ns');
        var domains = grunt.option('domain').split(',');

        if(undefined === nameServer || undefined === domains){
            grunt.log.error('use --ns and --domain');
            done(false);
            return;
        }

        server.createKey()
        .then(function(){
            return backupConfLocal();
        })
        .then(function(){
            done();
        });

    });

};


	
