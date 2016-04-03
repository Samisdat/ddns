'use strict';

var expect = require('chai').expect;

var expect = require('chai').expect;

var util = require('util');

var fs = require('fs');

var path = require("path");

var grunt = require('grunt');
var server = require('../../grunt/lib/server')(grunt);

var notFs = require('not-fs');

var rmdir = function(dir) {
    var list = fs.readdirSync(dir);

    for(var i = 0; i < list.length; i++) {
        var filename = path.join(dir, list[i]);
        var stat = fs.statSync(filename);
        
        if(filename == "." || filename == "..") {
            // pass these files
        } else if(stat.isDirectory()) {
            // rmdir recursively
            rmdir(filename);
        } else {
            // rm fiilename
            fs.unlinkSync(filename);
        }
    }
    fs.rmdirSync(dir);

};


describe('integration test', function() {

    describe('method server.backupConfLocal happypath', function() {
    
    beforeEach(function() {

        if(true === fs.existsSync('/etc/bind/')){
            rmdir('/etc/bind/');
        }

        fs.mkdirSync('/etc/bind/');

        fs.writeFileSync('/etc/bind/named.conf.local', 'Hello Node.js', 'utf8');
    });

        it('method exists and returns a promise', function(done) {

            var orginalExists = fs.existsSync('/etc/bind/named.conf.local');
            var backupExists = fs.existsSync('/etc/bind/named.conf.local.bac');

            expect(orginalExists).to.be.true;
            expect(backupExists).to.be.false;

            server.backupConfLocal()
            .then(function(){

                var orginal = fs.existsSync('/etc/bind/named.conf.local');
                var backup = fs.existsSync('/etc/bind/named.conf.local.bac');

                if(false === orginal && true === backup){
                    done();
                }
                else{
                    if(true === orginal){
                        done(new Error('orginal has not moved'))
                    }
                    else if(false === backup){
                        done(new Error('backup does not exists'))
                    }
                }

            })
            .fail(function(){
                done(new Error('backup failed'))
            });

        });

    });
});
