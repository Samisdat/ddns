/*global module, require */

var config = require('./lib/config');

module.exports = function (grunt) {

    "use strict";

    var client = require('./lib/client')(grunt);

    /**
     @TODO taring client to get it 
    */
    grunt.registerTask('client:create', 'create ddns client', function(args) {

        var done = this.async();

        client.createClient()
        .then(function(){
            done();
        })
        .catch(function(){
            grunt.log.error('something went wrong');
            done(false);
        });

    });


};


    
