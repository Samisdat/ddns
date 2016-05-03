'use strict';

var q = require('q');
var fs = require('fs');
var qexec = require('./qexec');
var qfs = require('./qfs');
var config = require('./config');

module.exports = function (grunt) {

    var createUpdateMessageScript = function(){

        var deferred = q.defer();

        qfs.fileExists('/ddns/client/create-update-message.sh')
        .then(function(){
            console.log('delete');  
            return qfs.unlink('/ddns/client/create-update-message.sh')
        })
        .catch(function(){
            console.log('not existed')  
            return q.resolve();
        })
        .then(function(){

            return qfs.copyFile(
                config.getTplPath() + 'update-message',  
                '/ddns/client/create-update-message.sh'
            );
        })
        .then(function(){
            var promises = [];

            var zoneTpl = fs.readFileSync(config.getTplPath() + 'update-message-zone',{encoding:'utf8'});

            config.getZones().forEach(function(zone){
                var zoneMsg = grunt.template.process(
                    zoneTpl, 
                    {
                        data:{
                            nameServer: nameServer,
                            ddnsDomain: zone
                        }
                    }
                );
                promises.push(
                    qfs.appendFile(
                        '/ddns/client/create-update-message.sh',
                        zoneMsg
                    )
                );
            });
            return q.all(promises);          
        })        
        .then(function(){
            return qexec(grunt.log, 'chmod +x /ddns/client/create-update-message.sh', 'make update script executable', 750, true);
        })
        .then(function(){
            console.log('done')
            deferred.resolve();
        });

        return deferred.promise;

    };

    var createClient = function(){

        var deferred = q.defer();
        qexec(grunt.log, 'mkdir -p /ddns/client', 'create dir for client', 0, true)
        .then(function () {
            return qfs.copyFile(
                '/ddns/key/' + config.getKeyName() + '.private',  
                '/ddns/client/ddns-key.private'
            );
        })
        .then(function () {
            return qfs.copyFile(
                '/ddns/key/' + config.getKeyName() + '.key',  
                '/ddns/client/ddns-key.key'
            );
        })
        .then(function () {
            return qfs.copyFile(config.getTplPath() + 'do-nsupdate',  '/ddns/client/do-nsupdate.sh');
        })
        .then(function () {
            return qexec(grunt.log, 'chmod +x /ddns/client/do-nsupdate.sh', 'make updatescript executable', 750, true);
        })
        .then(function () {
            return createUpdateMessageScript();
        })
        .then(function () {
            deferred.resolve();
        })

        return deferred.promise;

    };

    return{
        createUpdateMessageScript: createUpdateMessageScript,
        createClient: createClient
    };

};
