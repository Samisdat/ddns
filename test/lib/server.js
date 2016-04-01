'use strict';

var expect = require('chai').expect;

var fs = require('fs');
var grunt = require('grunt');
var server = require('../../grunt/lib/server')(grunt);

var vfs = function(){
    var memfs = require('memfs');

    var mem = new memfs.Volume;
    mem.mountSync('/etc/bind/', {
        "named.conf.local": "virtual"
    });


    var unionfs = require('unionfs');

    // Create a union of two file systems:
    unionfs
        .use(fs)
        .use(mem);

    unionfs.replace(fs);

};


describe('integration test', function() {

    describe('method server.backupConfLocal happypath', function() {
    
        beforeEach(vfs);

        it('method exists and returns a promise', function(done) {

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