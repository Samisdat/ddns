var _ = require('lodash');
var q = require('q');
var fs = require('fs');

/**
fs.exists is deprecated but fs.stat is not usable with memfs
var fileExists = function(fileName){

    var deferred = q.defer();

    if(true !== _.isString(fileName)){

       deferred.reject();

    }
    else{

        fs.stat(fileName, function(err, stats){

            if(null !== err){
                deferred.reject();
                return;
            }
            
            if(true !== stats.isFile()){
                deferred.reject();
                return;
            }

            deferred.resolve();    

        });

    }

    return deferred.promise;
};
 */

var fileExists = function(fileName){

    var deferred = q.defer();

    if(true !== _.isString(fileName)){

       deferred.reject();

    }
    else{

        fs.exists(fileName, function(exists){
            if(false === exists){
                deferred.reject();
                return;                
            }
            deferred.resolve();    
        });

    }

    return deferred.promise;
};

module.exports = {
    fileExists: fileExists
};