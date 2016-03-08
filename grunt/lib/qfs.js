var q = require('q');
var fs = require('fs');

var fileExists = function(fileName){

    var deferred = q.defer();

    // remove eventual existing config
    try {
        var stats = fs.statSync(fileName);
        if(true === stats.isFile()){
            deferred.resolve();
        }
        else{
            deferred.reject();
        }
    }
    catch (e) {
        deferred.reject();
    }


    return deferred.promise;
};

module.exports = {
    fileExists: fileExists
};