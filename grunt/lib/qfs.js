'use strict';

var _ = require('lodash');
var q = require('q');

module.exports = function(fs){

    if (undefined === fs){
        fs = require('fs');
    }

    /**
     * fs.exists is deprecated but fs.stat is not usable with memfs
     */
    var fileExists = function(fileName){

        var deferred = q.defer();

        if ( true !== _.isString(fileName)){

            deferred.reject();

        }
        else {

            var exists = fs.existsSync(fileName);

            if (false === exists){
                deferred.reject();
            }
            else {
                deferred.resolve();
            }

        }

        return deferred.promise;
    };

    var unlink = function(path){
        var deferred = q.defer();

        if (true !== _.isString(path)){

            deferred.reject();

        }
        else {

            fs.unlink(path, function(error){
                if (undefined !== error){
                    deferred.reject();
                    return;
                }

                deferred.resolve();

            });
        }

        return deferred.promise;
    };

    var readFile = function(file){

        var deferred = q.defer();

        fs.readFile(
            file,
            {encoding: 'utf8'},
            function(err, data){
                if (err){
                    deferred.reject(err);
                    return;
                }
                deferred.resolve(data);
            }
        );

        return deferred.promise;

    };

    var writeFile = function(file, data){

        var deferred = q.defer();

        fs.writeFile(
            file,
            data,
            {encoding: 'utf8'},
            function(err){
                if (err){
                    deferred.reject(err);
                    return;
                }
                deferred.resolve();
            }
        );

        return deferred.promise;

    };

    var appendFile = function(file, data){

        var deferred = q.defer();

        fs.appendFile(
            file,
            data,
            {encoding: 'utf8'},
            function(err){
                if (err){
                    deferred.reject(err);
                    return;
                }
                deferred.resolve();
            }
        );

        return deferred.promise;

    };

    return {
        fileExists: fileExists,
        unlink: unlink,
        readFile: readFile,
        writeFile: writeFile,
        appendFile: appendFile
    };
};
