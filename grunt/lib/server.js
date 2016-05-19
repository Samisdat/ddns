'use strict';

var q = require('q');
var fs = require('fs');
var qexec = require('./qexec');
var qfs = require('./qfs');
var config = require('./config');
var client = require('./client');

module.exports = function (grunt) {

    var key = require('./key')(grunt);

    var backupConfLocal = function(){

        var deferred = q.defer();

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

            deferred.reject('/etc/bind/named.conf.local does not exists');
        });

        return deferred.promise;
    };

    var removeConfLocal = function(){
        return qfs.unlink('/etc/bind/named.conf.local');
    };

    var createConfLocal = function(){
        return qfs.writeFile('/etc/bind/named.conf.local', '// generated by samisdat/ddns');
    };

    var addKeyToConfLocal = function(){

        var deferred = q.defer();

        key.readKey()
        .then(function (dnskey) {

            var keyTpl = fs.readFileSync(config.getTplPath() + 'key', {encoding: 'utf8'});

            var keyPart = grunt.template.process(keyTpl, {'data': {'dnssec_key': dnskey}});

            qfs.appendFile('/etc/bind/named.conf.local', keyPart)
            .then(function(){
                deferred.resolve();
            });

        })
        .fail(function(){

            deferred.reject('could not read key');

        });

        return deferred.promise;
    };

    var createZone = function(nameServer, ddnsDomain){

        var data = {
            nameServer: nameServer,
            ddnsDomain: ddnsDomain
        };

        var dbTpl = fs.readFileSync(config.getTplPath() + 'db', {encoding: 'utf8'});
        var db = grunt.template.process(dbTpl, {data: data});

        var zoneTpl = fs.readFileSync(config.getTplPath() + 'zone', {encoding: 'utf8'});
        var zone = grunt.template.process(zoneTpl, {data: data});

        return q.all([
            qfs.writeFile('/etc/bind/db.' + ddnsDomain, db),
            qfs.appendFile('/etc/bind/named.conf.local', zone)
        ]);
    };

    var createZones = function(){

        var nameServer = config.getNameServer();
        var zones = config.getZones();

        if (undefined === nameServer || 0 === zones.length){
            var deferred = q.defer();

            deferred.reject();

            return deferred.promise;
        }

        var promises = [];

        for (var i = 0, x = zones.length; i < x; i += 1){
            promises.push(createZone(nameServer, zones[i]));
        }

        return q.all(promises);

    };

    var enableLogging = function(){

        var deferred = q.defer();

        var logConfig = fs.readFileSync(config.getTplPath() + 'logging', {encoding: 'utf8'});

        fs.appendFileSync('/etc/bind/named.conf.local', logConfig);

        if (false === fs.existsSync('/var/log/named/')){
            fs.mkdirSync('/var/log/named/');
        }


        qexec(grunt.log, 'chown bind:bind /var/log/named/', 'set correct rights for log file', 750, true)
        .then(function () {

            deferred.resolve();

        }).fail(function(){

            deferred.reject();

        });

        return deferred.promise;
    };

    /* this is needed to make sure that *.jnl can be created */
    var chownBindDir = function(){

        return qexec(grunt.log, 'chown bind:bind /etc/bind', 'let bind own it\'s dir', 750, true);
    };

    var restartBind = function(){

        return qexec(grunt.log, 'service bind9 restart', 'bind restart', 0, true);
    };

    var firstSetup = function(nameServer, domains){

        var deferred = q.defer();


        key.create()
        .then(function(){
            return backupConfLocal();
        })
        .then(function(){
            return removeConfLocal();
        })
        .fail(function(){
            return q.resolve();
        })
        .then(function(){
            return createConfLocal();
        })
        .then(function(){
            return addKeyToConfLocal();
        })
        .then(function(){
            return createZones(nameServer, domains);
        })
        .then(function(){
            return enableLogging();
        })
        .then(function(){
            return chownBindDir();
        })
        .then(function(){
            return restartBind();
        })
        .then(function(){
            deferred.resolve();
        });

        return deferred.promise;
    };

    return {
        removeConfLocal: removeConfLocal,
        createConfLocal: createConfLocal,
        backupConfLocal: backupConfLocal,
        addKeyToConfLocal: addKeyToConfLocal,
        createZone: createZone,
        createZones: createZones,
        enableLogging: enableLogging,
        chownBindDir: chownBindDir,
        firstSetup: firstSetup
    };

};
