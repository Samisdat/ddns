'use strict';

var expect = require('chai').expect;

var util = require('util');
var q = require('q');

var fs = require('fs');

var rmdir = require('../../grunt/lib/rmdir');
var grunt = require('grunt');
var server = require('../../grunt/lib/server')(grunt);

var notFs = require('not-fs');

describe('testing in real file sys', function() {

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

            server.readKey()
            .then(function(key){
                done();
            })
            
        });

    });
    
});

describe('integration test', function() {

    before(function() {
        notFs.swapIn();
    });
    
    after(function() {
        notFs.swapOut();
    });

    describe('method server.removeConfLocal and server.createConfLocal', function() {
    
        beforeEach(function() {
            if(true === fs.existsSync('/etc/bind/')){
                rmdir('/etc/bind/');
            }

            notFs.mkdirSync('/etc/bind/');

            notFs.writeFileSync('/etc/bind/named.conf.local', 'Hello Node.js', 'utf8');
        });

        it('removeConfLocal', function(done) {

            var exists = fs.existsSync('/etc/bind/named.conf.local');
            expect(exists).to.be.true;

            server.removeConfLocal()
            .then(function(){

                var exists = fs.existsSync('/etc/bind/named.conf.local');
                expect(exists).to.be.false;

                done();
            })
            .fail(function(){
                done(new Error('should work'));
            });

        });

        it('createConfLocal', function(done) {

            notFs.unlinkSync('/etc/bind/named.conf.local');

            var exists = fs.existsSync('/etc/bind/named.conf.local');
            expect(exists).to.be.false;

            server.createConfLocal()
            .then(function(){

                var exists = fs.existsSync('/etc/bind/named.conf.local');
                expect(exists).to.be.true;

                done();
            })
            .fail(function(){
                done(new Error('should work'));
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

    describe('method server.readKey', function() {
    
        beforeEach(function() {
            if(true === fs.existsSync('/ddns/key/')){
                rmdir('/ddns/key/');
            }

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

            expect(server.readKey).to.be.instanceof(Function);

            var promise = server.readKey();

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

    describe('method server.addKeyToConfLocal', function() {
    
        beforeEach(function() {

            if(true === fs.existsSync('/etc/bind/')){
                rmdir('/etc/bind/');
            }

            notFs.mkdirSync('/etc/bind/');

            notFs.writeFileSync('/etc/bind/named.conf.local', '', 'utf8');

            if(true === fs.existsSync('/ddns/key/')){
                rmdir('/ddns/key/');
            }

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

            if(true === fs.existsSync('/var/docker-ddns/tpls/')){
                rmdir('/var/docker-ddns/tpls/');
            }

            notFs.copyFromFs('/var/docker-ddns/tpls/', true);


        });

        it('method exists and returns a promise', function() {

            expect(server.addKeyToConfLocal).to.be.instanceof(Function);

            var promise = server.addKeyToConfLocal();

            expect(q.isPromise(promise)).to.be.true;

        });

        it('find key', function(done) {

            server.addKeyToConfLocal()
            .then(function(){
                var localConf = fs.readFileSync('/etc/bind/named.conf.local');

                var expectLocalConf = [];
                expectLocalConf.push('');
                expectLocalConf.push('key "DDNS_UPDATE" {');
                expectLocalConf.push('    algorithm hmac-md5;');
                expectLocalConf.push('    secret "aaaaaaaaaaaaaaaaaaaaaa==";');
                expectLocalConf.push('};');   
                expectLocalConf.push('');                    
                expectLocalConf = expectLocalConf.join("\n")
               
                expect(localConf).to.be.equal(expectLocalConf);                                
               
                done();
            })
            .fail(function(){
                done('no key found')
            });
        });

    });

    describe('method server.createZone', function() {
    
        beforeEach(function() {

            if(true === fs.existsSync('/etc/bind/')){
                rmdir('/etc/bind/');
            }

            notFs.mkdirSync('/etc/bind/');

            notFs.writeFileSync('/etc/bind/named.conf.local', '', 'utf8');

        });

        it('method exists and returns a promise', function() {

            expect(server.createZone).to.be.instanceof(Function);

            var promise = server.createZone();

            expect(q.isPromise(promise)).to.be.true;

        });

        it('createZone', function(done) {

            var dbFileExists = fs.existsSync('/etc/bind/db.dev.example.com');
            expect(dbFileExists).to.be.false;

            var localConf = fs.readFileSync('/etc/bind/named.conf.local', '', 'utf8');
            expect(localConf).to.be.equal('');

            server.createZone()
            .then(function(){

                var localConfExpect = [];
                localConfExpect.push('zone "dev.example.com" {');
                localConfExpect.push('    type master;');
                localConfExpect.push('    file "/etc/bind/db.dev.example.com";');
                localConfExpect.push('    allow-update { key "DDNS_UPDATE"; };');
                localConfExpect.push('};');
                localConfExpect.push('');

                var localConf = fs.readFileSync('/etc/bind/named.conf.local');
                
                expect(localConf).to.be.equal(localConfExpect.join("\n"));

                var dbFileExpect = [];
                dbFileExpect.push('$TTL    30');
                dbFileExpect.push('@    IN    SOA    ns.example.com. root.localhost. (');
                dbFileExpect.push('                  3        ; Serial');
                dbFileExpect.push('             604800        ; Refresh');
                dbFileExpect.push('              86400        ; Retry');
                dbFileExpect.push('            2419200        ; Expire');
                dbFileExpect.push('              86400 )    ; Negative Cache TTL');
                dbFileExpect.push(';');
                dbFileExpect.push('@        IN    NS    ns.example.com.');
                dbFileExpect.push('@        IN    A    127.0.0.1');
                dbFileExpect.push('*        IN    CNAME     dev.example.com.');
                dbFileExpect.push('');

                var dbFile = fs.readFileSync('/etc/bind/db.dev.example.com');

                expect(dbFile).to.be.equal(dbFileExpect.join("\n"));

                done();

            });

        });

    });
    
});
