/*global module, require */

var Q = require('q');
var fs = require('fs');
var exec = require('child_process').exec;

var qfs = require('./lib/qfs')();
var server = require('./lib/server');

//TODO Check and update fingerprint

var server = function(grunt){

    "use strict";

    var path_to_tpls = '/var/grobdns/tpls/';

    var nameServer = 'ns.example.com';
    var ddnsDomain = 'dev.example.com';

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

    var add_key_to_config = function(){
        var deferred = Q.defer();

        execCmd('cat /ddns/key/Kddns_update*.private | grep Key | cut -d " " -f 2', 'read key')
        .then(function (response) {

            var key = response.stdout;

            if(undefined === key){
                deferred.reject('could not read key')
            }
            
            key = key.trim();

            var keyTpl = fs.readFileSync(path_to_tpls + 'key',{encoding:'utf8'});

            var keyPart = grunt.template.process(keyTpl, {data: {dnssec_key:key}});

            return execCmd('echo "' + keyPart + '" >> /etc/bind/named.conf.local', 'add key to /etc/bind/named.conf.local');

        })
        .then(function () {
            deferred.resolve();
        })
        .fail(function(){

            deferred.reject('could not read key');

        });

        return deferred.promise;
    };

	var create_zone = function(){
        var deferred = Q.defer();

        var data = {
            nameServer: nameServer,
            ddnsDomain: ddnsDomain
        };

        var dbTpl = fs.readFileSync(path_to_tpls + 'db',{encoding:'utf8'});
        var db = grunt.template.process(dbTpl, {data: data});

        var zoneTpl = fs.readFileSync(path_to_tpls + 'zone',{encoding:'utf8'});
        var zone = grunt.template.process(zoneTpl, {data: data});

        fs.writeFileSync('/etc/bind/db.' + ddnsDomain, db);

        fs.appendFile('/etc/bind/named.conf.local', zone);
        
        execCmd('chown bind:bind "/etc/bind/db.' + ddnsDomain + '"', 'somehelptext', 750, true)
        .then(function (response) {

            deferred.resolve();

        }).fail(function(){

            deferred.reject();

        });

        return deferred.promise;
    };
	
	var enable_logging = function(){
        var deferred = Q.defer();

        var logConfig = fs.readFileSync(path_to_tpls + 'logging',{encoding:'utf8'});
        fs.appendFile('/etc/bind/named.conf.local', logConfig);

        fs.mkdirSync('/var/log/named/');

        execCmd('chown bind:bind /var/log/named/', 'somehelptext', 750, true)
        .then(function (response) {

            deferred.resolve();

        }).fail(function(){

            deferred.reject();

        });

        return deferred.promise;
    };

	var config_bind = function(){
        var deferred = Q.defer();

        // remove eventual existing config
        try {
            var stats = fs.statSync('/etc/bind/named.conf.local');
            if(true === stats.isFile()){
                fs.unlinkSync('/etc/bind/named.conf.local');
            }
        }
        catch (e) {
            // do nothing if file does not exist
        }


        fs.writeFileSync('/etc/bind/named.conf.local', '// generated by samisdat/ddns');


        execCmd('chown bind:bind /etc/bind/named.conf.local', 'somehelptext', 750, true)
        .then(function (response) {

            // enable logging was commented out
            //enable_logging

            // this is needed or *.jnl can not be created
            return execCmd('chown bind:bind /etc/bind', 'somehelptext"');

        })
        .then(function (response) {

            deferred.resolve();

        })
        .fail(function(){

            deferred.reject();

        });

        return deferred.promise;
    };

    var restart_bind = function(){
        var deferred = Q.defer();

        execCmd('service bind9 restart', 'restart bind9', 750, true)
        .then(function () {

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
    var _setup = function(){
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

    var backupConfLocal = function(){
        var deferred = Q.defer();

        qfs.fileExists('/etc/bind/named.conf.local')
        .then(function(){
    
            grunt.log.write('Backup "/etc/bind/named.conf.local"... ');

            qfs.rename('/etc/bind/named.conf.local', '/etc/bind/named.conf.local.bac')
            .then(function(){
                grunt.log.ok();
                deferred.resolve();
            })
            .fail(function(){
                deferred.reject(response);
                grunt.log.error();                
            });         

        })
        .fail(function(){
            deferred.resolve();
        })
    
        return deferred.promise;
    };

    var firstSetup = function(){
        console.log('firstSetup')
        backupConfLocal();

        // backup /etc/bind/named.conf.local

        /*
        rm -f /etc/bind/named.conf.local

        touch /etc/bind/named.conf.local
        chown bind:bind /etc/bind/named.conf.local

        echo "// generated by samisdat/ddns" > /etc/bind/named.conf.local


        read_key
        read_configs

        #enable_logging

        # this is needed or *.jnl can not be created
        chown bind:bind /etc/bind

        service bind9 restart
        */
    };

    return{
    	create_key:create_key,
		add_key_to_config: add_key_to_config,
		create_zone: create_zone,
		enable_logging: enable_logging,
		config_bind: config_bind,
		create_client: create_client,
        setup:_setup,
        backupConfLocal:backupConfLocal,
        firstSetup: firstSetup
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

	grunt.registerTask('server:add_key_to_config', 'help', function(args) {

        var done = this.async();

        server(grunt).add_key_to_config()
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

        server(grunt).create_zone()
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

        server(grunt).enable_logging()
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

        server(grunt).config_bind()
        .then(function(){
            done();
        })
        .catch(function(){
            grunt.log.error('something went wrong');
            done(false);
        });

    });

    grunt.registerTask('server:prepare', 'help', function(args) {

        var done = this.async();

        server(grunt).firstSetup()
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


	
