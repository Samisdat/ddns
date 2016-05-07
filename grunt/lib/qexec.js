'use strict';

var q = require('q');
var exec = require('child_process').exec;

/**
 * Execute shell cmd via child_process
 */
var promiseToExec = function(gruntLog, cmd, message, timeout, debug){

    var deferred = q.defer();

    if (undefined === gruntLog){
        gruntLog = {};
    }

    if (undefined === gruntLog.write){
        gruntLog.write = function(){};
    }
    if (undefined === gruntLog.ok){
        gruntLog.ok = function(){};
    }
    if (undefined === gruntLog.error){
        gruntLog.error = function(){};
    }

    if (undefined === message){
        message = cmd;
    }

    if (undefined === timeout){
        timeout = 0;
    }

    if (undefined === debug){
        debug = false;
    }

    gruntLog.write(message + '... ');

    if (true === debug){
        gruntLog.write(cmd);
    }

    exec(
        cmd,
        {
            timeout: timeout
        },
        function (error, stdout, stderr) {

            if (true === debug){
                gruntLog.write('error', error);
                gruntLog.write('stdout', stdout);
                gruntLog.write('stderr', stderr);
            }

            var response = {
                error: error,
                stdout: stdout,
                stderr: stderr
            };

            if (null === error){
                deferred.resolve(response);
                gruntLog.ok();
                return;
            }
            if (null !== error) {
                deferred.reject(response);
                gruntLog.error();
                return;
            }

        }
    );

    return deferred.promise;
};

module.exports = promiseToExec;
