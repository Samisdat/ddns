var expect = require('chai').expect;
var assert = require('chai').assert;

var q = require('q');
var qfs = require('../grunt/lib/qfs');

var unionfs = require('unionfs');
var fs = require('fs');
var memfs = require('memfs');

var mem = new memfs.Volume;
mem.mountSync('/etc/bind/', {
    "named.conf.local": "just a file"
});

unionfs.use(fs).use(mem);
unionfs.replace(fs);

describe('method qfs.fileExists', function() { 

    it('method exists and returns a promise', function() {

        expect(qfs.fileExists).to.exist
        expect(qfs.fileExists).to.be.instanceof(Function);

        var promise = qfs.fileExists('/etc/bind/named.conf.local');

        expect(promise.then).to.be.instanceof(Function);
        expect(promise.fail).to.be.instanceof(Function);

    }); 

    it('succeeded on existing file', function(done) {

        //var promise = qfs.fileExists('/etc/bind/named.conf.local');
        var promise = qfs.fileExists('/etc/bind/named.conf.local');
        promise.then(function(){
            done();
        });    

        promise.fail(function(){
            done(new Error('File don\'t exist'));
        })    

    }); 

    it('fails on not existing file', function(done) {

        //var promise = qfs.fileExists('/etc/bind/named.conf.local');
        var promise = qfs.fileExists('/etc/bind/named.conf.loca');
        promise.then(function(){
            done(new Error('file don\'t exist'));
        });    

        promise.fail(function(){
            done();
        })    

    }); 

    it('fails when file name is not a sstring', function(done) {

        //var promise = qfs.fileExists('/etc/bind/named.conf.local');
        var promise = qfs.fileExists();
        promise.then(function(){
            done(new Error('file don\'t exist'));
        });    

        promise.fail(function(){
            done();
        })    

    }); 

});
