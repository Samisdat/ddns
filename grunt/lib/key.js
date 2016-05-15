'use strict';

var q = require('q');
var fs = require('fs');
var qexec = require('./qexec');
var qfs = require('./qfs');
var config = require('./config');

module.exports = function (grunt) {

    var createKey = function(){

        var deferred = q.defer();

        qexec(grunt.log, 'mkdir -p /ddns/key', 'create dir for key', 750, true)
        .then(function () {
            config.setKeyName(undefined);
            return qexec(grunt.log, 'rm -f /ddns/key/Kddns_update*', 'delete key if already exists');
        })
        .then(function () {
            return qexec(grunt.log, 'dnssec-keygen -K /ddns/key/ -a HMAC-MD5 -b 128 -r /dev/urandom -n USER DDNS_UPDATE', 'create key');
        })
        .then(function (response) {
            config.setKeyName(response.stdout.trim());
            deferred.resolve();
        })
        .fail(function(){
            deferred.reject('key could not be created');
        });

        return deferred.promise;
    };

    var readKey = function(){
        var deferred = q.defer();

        qfs.readdir('/ddns/key')
        .then(function(files){

            if (2 !== files.length){
                deferred.reject();
            }

            var privateKey = false;
            for (var i = 0, x = files.length; i < x; i += 1){
                if (true === /^Kddns_update\.(.*?)\.private$/.test(files[i])){
                    privateKey = files[i];
                }
            }

            if (false === privateKey){
                deferred.reject();
            }

            qfs.readFile('/ddns/key/' + privateKey)
            .then(function(data){

                var key = data.match(/Key\: (.*?)[\n\r]/m);

                if (null === key){
                    deferred.reject();
                }

                deferred.resolve(key[1]);

            })
            .fail(function(error){
                deferred.reject(error);
            });


        })
        .fail(function(error){
            deferred.reject(error);
        });

        return deferred.promise;
    };


    return {
        createKey: createKey,
        readKey: readKey
    };

};
