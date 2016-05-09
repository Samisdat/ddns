'use strict';

var expect = require('chai').expect;

var grunt = require('grunt');

var config = require('../../grunt/lib/config');
var server = require('../../grunt/lib/server')(grunt);
var client = require('../../grunt/lib/client')(grunt);
var qexec = require('../../grunt/lib/qexec');

describe('config ', function() {

    it('can create zone', function(done) {

        config.setNameServer('ns.example.org');
        config.addZone('dev.example.org');

        server.firstSetup()
        .then(function(){
            console.log(config.getZones());
            done();
        });        

    });

    it('can create zone', function(done) {

        qexec(grunt.log, 'dig @localhost dev.example.org +short', 'local dig', 10000, true)
        .then(function(response){
            expect(response.stdout.trim()).to.be.equal('127.0.0.1');
            done();
        });        

    });

    it.skip('can create client', function(done) {

        client.createClient()
        .then(function(response){
            done();
        });        

    });

});
