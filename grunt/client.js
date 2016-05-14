/*global module, require */

'use strict';

module.exports = function (grunt) {

    var client = require('./lib/client')(grunt);

    /**
     @TODO taring client to get it
    */
    grunt.registerTask('client:create', 'create ddns client', function() {

        var done = this.async();

        client.createClient()
        .then(function(){
            return client.tarClient();
        })
        .then(function(){
            done();
        })
        .catch(function(){
            grunt.log.error('something went wrong');
            done(false);
        });

    });


};



