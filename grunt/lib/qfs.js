var _ = require('lodash');
var q = require('q');

module.exports = function(fs){

    if(undefined === fs){
        fs = require('fs');
    }

    /**
     *fs.exists is deprecated but fs.stat is not usable with memfs
     */
    var fileExists = function(fileName){

        var deferred = q.defer();

        if(true !== _.isString(fileName)){

           deferred.reject();

        }
        else{

            var exists = fs.existsSync(fileName);

            if(false === exists){
                deferred.reject();
            }
            else{
                deferred.resolve();    
            }

        }

        return deferred.promise;
    };

    return {
        fileExists: fileExists
    }
};