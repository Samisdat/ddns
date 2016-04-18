'use strict';

var expect = require('chai').expect;

var util = require('util');
var q = require('q');

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

describe('testing real file sys', function() {

    beforeEach(function() {
        if(true === fs.existsSync('/ddns/key')){
            rmdir('/ddns/key/');
        }
    });

    it('createkey', function(done) {
        
        var dirExists = fs.existsSync('/ddns/key');
        expect(dirExists).to.be.false;

        server.createKey()
        .then(function(){

            var dirExists = fs.existsSync('/ddns/key');
            expect(dirExists).to.be.true;

            done();            
            
        });

    });
    
});


describe.skip('integration test', function() {

    before(function() {
        notFs.swapIn();
    });
    
    after(function() {
        notFs.swapOut();
    });

    describe('method server.backupConfLocal', function() {
    
        beforeEach(function() {
            if(true === fs.existsSync('/etc/bind/')){
                rmdir('/etc/bind/');
            }

            notFs.mkdirSync('/etc/bind/');

            notFs.writeFileSync('/etc/bind/named.conf.local', 'Hello Node.js', 'utf8');
        });

        it('named.conf.local does not exists', function(done) {

            notFs.unlinkSync('/etc/bind/named.conf.local');

            var orginalExists = fs.existsSync('/etc/bind/named.conf.local');
            expect(orginalExists).to.be.false;

            server.backupConfLocal()
            .then(function(){
                done(new Error('should not work'));
            })
            .fail(function(){
                done();
            });

        });

        it('method exists and returns a promise', function(done) {

            var orginalExists = notFs.existsSync('/etc/bind/named.conf.local');
            var backupExists = notFs.existsSync('/etc/bind/named.conf.local.bac');

            expect(orginalExists).to.be.true;
            expect(backupExists).to.be.false;

            server.backupConfLocal()
            .then(function(){

                var orginal = notFs.existsSync('/etc/bind/named.conf.local');
                var backup = notFs.existsSync('/etc/bind/named.conf.local.bac');

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

    describe('method server.backupConfLocal', function() {
    
        beforeEach(function() {
            if(true === fs.existsSync('/etc/bind/')){
                rmdir('/etc/bind/');
            }

            notFs.mkdirSync('/etc/bind/');

            notFs.writeFileSync('/etc/bind/named.conf.local', 'Hello Node.js', 'utf8');
        });

        it('named.conf.local does not exists', function(done) {
            server.firstSetup();
        });
    describe('method server.readKey', function() {
    
        beforeEach(function() {
            if(true === fs.existsSync('/ddns/key/')){
                rmdir('/ddns/key/');
            }

            notFs.unlinkSync('/etc/bind/named.conf.local');
            notFs.mkdirSync('/ddns/key/');

            var key = [];
            key.push('Private-key-format: v1.3');
            key.push('Algorithm: 157 (HMAC_MD5)');
            key.push('Key: aaaaaaaaaaaaaaaaaaaaaa==');
            key.push('Bits: AAA=');
            key.push('Created: 20160413014957');
            key.push('Publish: 20160413014957');
            key.push('Activate: 20160413014957');           

            notFs.writeFileSync('/ddns/key/Kddns_update.+157+52345.private', key.join("\n"), 'utf8');

            notFs.writeFileSync('/ddns/key/Kddns_update.+157+52345.key', 'DDNS_UPDATE. IN KEY 0 3 157 aaaaaaaaaaaaaaaaaaaaaa==', 'utf8');            

        });

        it('method exists and returns a promise', function() {

            expect(server.addKeyToConfLocal).to.be.instanceof(Function);

            var promise = server.addKeyToConfLocal();

            expect(q.isPromise(promise)).to.be.true;

        });

        it('find key', function(done) {
            server.readKey()
            .then(function(key){
                expect(key).to.be.equal('aaaaaaaaaaaaaaaaaaaaaa==');                
                done();
            })
            .fail(function(){
                done('no key found')
            });
        });
    });

    
});
