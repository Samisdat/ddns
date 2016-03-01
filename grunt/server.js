/*global module, require */

var Q = require('q');
var fs = require('fs');
var exec = require('child_process').exec;

//TODO Check and update fingerprint

var server = function(grunt){

    "use strict";

    /**
     * Execute shell cmd via child_process
     */
    var execCmd = function(cmd, message, timeout, debug){
        var deferred = Q.defer();

        if(undefined === message){
            message = cmd;
        }

        if(undefined === timeout){
            timeout = 0;
        }

        if(undefined === debug){
            debug = false;
        }

        grunt.log.write(message+ '... ');

        if(true === debug){
            grunt.log.write(cmd);
        }

        var child = exec(
            cmd,
            {
                timeout: timeout
            },
            function (error, stdout, stderr) {
                if(true === debug){
                    grunt.log.write('error', error);
                    grunt.log.write('stdout', stdout);
                    grunt.log.write('stderr', stderr);
                }

                var response = {
                    error: error,
                    stdout: stdout,
                    stderr: stderr
                };

                if(null === error){
                    deferred.resolve(response);
                    grunt.log.ok();
                    return;
                }
                if (null !== error) {
                    deferred.reject(response);
                    grunt.log.error();
                    return;
                }

            }
        );

        return deferred.promise;
    };


    var create_key = function(){
        var deferred = Q.defer();

        execCmd('mkdir -p /ddns/key', 'create dir for key')
        .then(function () {
			return execCmd('rm -f /ddns/key/Kddns_update*', 'delete key if already exists')

        })
        .then(function () {
			return execCmd('dnssec-keygen -K /ddns/key/ -a HMAC-MD5 -b 128 -r /dev/urandom -n USER DDNS_UPDATE', 'create key')
        })
        .then(function () {
        	deferred.resolve();
        })
        .fail(function(){
        	deferred.reject('key could not be created');	
        });

        return deferred.promise;
    };

	var read_key = function(){
        var deferred = Q.defer();

        execCmd('some cmd', 'somehelptext"', 750, true)
        .then(function (response) {

            var json = JSON.parse(response.stdout);
            deferred.resolve(json[0]);

        }).fail(function(){

            deferred.reject();

        });

        return deferred.promise;
    };

	var create_zone = function(){
        var deferred = Q.defer();

        execCmd('some cmd', 'somehelptext"', 750, true)
        .then(function (response) {

            var json = JSON.parse(response.stdout);
            deferred.resolve(json[0]);

        }).fail(function(){

            deferred.reject();

        });

        return deferred.promise;
    };
	
	var read_config = function(){
        var deferred = Q.defer();

        execCmd('some cmd', 'somehelptext"', 750, true)
        .then(function (response) {

            var json = JSON.parse(response.stdout);
            deferred.resolve(json[0]);

        }).fail(function(){

            deferred.reject();

        });

        return deferred.promise;
    };
	
	var read_configs = function(){
        var deferred = Q.defer();

        execCmd('some cmd', 'somehelptext"', 750, true)
        .then(function (response) {

            var json = JSON.parse(response.stdout);
            deferred.resolve(json[0]);

        }).fail(function(){

            deferred.reject();

        });

        return deferred.promise;
    };

	var enable_logging = function(){
        var deferred = Q.defer();

        execCmd('some cmd', 'somehelptext"', 750, true)
        .then(function (response) {

            var json = JSON.parse(response.stdout);
            deferred.resolve(json[0]);

        }).fail(function(){

            deferred.reject();

        });

        return deferred.promise;
    };

	var config_bind = function(){
        var deferred = Q.defer();

        execCmd('some cmd', 'somehelptext"', 750, true)
        .then(function (response) {

            var json = JSON.parse(response.stdout);
            deferred.resolve(json[0]);

        }).fail(function(){

            deferred.reject();

        });

        return deferred.promise;
    };

	var create_client = function(){
        var deferred = Q.defer();

        execCmd('some cmd', 'somehelptext"', 750, true)
        .then(function (response) {

            var json = JSON.parse(response.stdout);
            deferred.resolve(json[0]);

        }).fail(function(){

            deferred.reject();

        });

        return deferred.promise;
    };


    var container = grunt.option('container');
    var remote = grunt.option('remote');

    /**
     * complete setup process
     */
    var setup = function(){
        var json;

        // handle task
        var deferred = Q.defer();


        if(undefined === remote){
            remote = '/';
        }

        grunt.log.subhead('Mount container via sshfs');

        inspect(container).then(function(_json){
            json = _json;
            if(true !== json.State.Running){
                grunt.log.write('container is not running...');
                grunt.log.error();
                deferred.reject();
            }

            return createKey(container);

        })
        .then(function(){
            return checkShhPort(json.NetworkSettings.Ports);
        })
        .then(function(){
            return checkOpenSshIsInstalled(container, json.Id);
        })
        .then(function(){
            return addKey(container, json.Id);
        })
        .then(function(){
            return startSsh(container);
        })
        .then(function(){
            var port = json.NetworkSettings.Ports['22/tcp'][0].HostPort;
            return mountSshFs(container, port, remote);
        })
        .then(function(){
            deferred.resolve();
        })
        .catch(function(){
            deferred.reject();
        });

        return deferred.promise;

    };


    return{
    	create_key:create_key,
		read_key: read_key,
		create_zone: create_zone,
		read_config: read_config,
		read_configs: read_configs,
		enable_logging: enable_logging,
		config_bind: config_bind,
		create_client: create_client,
        setup:setup
    };


};




module.exports = function (grunt) {

    "use strict";

	grunt.registerTask('server:create_key', 'help', function(args) {

        var done = this.async();

        server(grunt).create_key()
        .then(function(){
            done();
        })
        .catch(function(){
            grunt.log.error('something went wrong');
            done(false);
        });

    });

	grunt.registerTask('server:read_key', 'help', function(args) {

        var done = this.async();

        server(grunt).create_key()
        .then(function(){
            done();
        })
        .catch(function(){
            grunt.log.error('something went wrong');
            done(false);
        });

    });

	grunt.registerTask('server:create_zone', 'help', function(args) {

        var done = this.async();

        server(grunt).create_key()
        .then(function(){
            done();
        })
        .catch(function(){
            grunt.log.error('something went wrong');
            done(false);
        });

    });

	grunt.registerTask('server:read_config', 'help', function(args) {

        var done = this.async();

        server(grunt).create_key()
        .then(function(){
            done();
        })
        .catch(function(){
            grunt.log.error('something went wrong');
            done(false);
        });

    });

	grunt.registerTask('server:read_configs(', 'help', function(args) {

        var done = this.async();

        server(grunt).create_key()
        .then(function(){
            done();
        })
        .catch(function(){
            grunt.log.error('something went wrong');
            done(false);
        });

    });

	grunt.registerTask('server:enable_logging', 'help', function(args) {

        var done = this.async();

        server(grunt).create_key()
        .then(function(){
            done();
        })
        .catch(function(){
            grunt.log.error('something went wrong');
            done(false);
        });

    });

	grunt.registerTask('server:config_bind', 'help', function(args) {

        var done = this.async();

        server(grunt).create_key()
        .then(function(){
            done();
        })
        .catch(function(){
            grunt.log.error('something went wrong');
            done(false);
        });

    });

	grunt.registerTask('server:create_client', 'help', function(args) {

        var done = this.async();

        server(grunt).create_key()
        .then(function(){
            done();
        })
        .catch(function(){
            grunt.log.error('something went wrong');
            done(false);
        });

    });

};



