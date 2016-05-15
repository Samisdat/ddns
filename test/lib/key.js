'use strict';

/*
cmd to get ip from local dns
dig @localhost dev.foo.org +short
*/

var expect = require('chai').expect;

var q = require('q');
var fs = require('fs');

var rmdir = require('../../grunt/lib/rmdir');

var grunt = require('grunt');
grunt.log.write = function(){};
grunt.log.ok = function(){};
grunt.log.error = function(){};

var key = require('../../grunt/lib/key')(grunt);
var config = require('../../grunt/lib/config');

describe('testing in real file sys', function() {

    beforeEach(function() {
        if (true === fs.existsSync('/ddns/key')){
            rmdir('/ddns/key/');
        }
    });

    it('succeed in create a key ', function(done) {

        var dirExists = fs.existsSync('/ddns/key');
        expect(dirExists).to.be.false;

        key.createKey()
        .then(function(){

            dirExists = fs.existsSync('/ddns/key');
            expect(dirExists).to.be.true;

            key.readKey()
            .then(function(){
                done();
            });

        });

    });

});


'use strict';

/*
cmd to get ip from local dns
dig @localhost dev.foo.org +short
*/

var expect = require('chai').expect;

var q = require('q');
var fs = require('fs');

var rmdir = require('../../grunt/lib/rmdir');

var grunt = require('grunt');
grunt.log.write = function(){};
grunt.log.ok = function(){};
grunt.log.error = function(){};

var server = require('../../grunt/lib/server')(grunt);
var config = require('../../grunt/lib/config');
var notFs = require('not-fs');

describe('testing in real file sys', function() {

    beforeEach(function() {
        if (true === fs.existsSync('/ddns/key')){
            rmdir('/ddns/key/');
        }
    });

    it('succeed in create a key ', function(done) {

        var dirExists = fs.existsSync('/ddns/key');
        expect(dirExists).to.be.false;

        server.createKey()
        .then(function(){

            dirExists = fs.existsSync('/ddns/key');
            expect(dirExists).to.be.true;

            server.readKey()
            .then(function(){
                done();
            });

        });

    });

});



describe('method server.readKey', function() {

    before(function() {
        notFs.swapIn();
    });

    after(function() {
        notFs.swapOut();
    });

    beforeEach(function() {
        if (true === fs.existsSync('/ddns/key/')){
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

        notFs.writeFileSync('/ddns/key/Kddns_update.+157+52345.private', key.join('\n'), 'utf8');

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
            done('no key found');
        });
    });

});

