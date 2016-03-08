var expect = require('chai').expect;
var assert = require('chai').assert;


var createVirtualFileSystem = (function(){

    var memfs = require('memfs');
    var mem = new memfs.Volume;
    mem.mountSync('/etc/bind/', {
        'named.conf.local': 'just a file'
    });

    var unionfs = require('unionfs');
    var fs = require('fs');

    unionfs.use(mem);

    unionfs.replace(fs);

});


var q = require('q');
var qfs = require('../grunt/lib/qfs');



describe('method qfs.fileExists', function() { 

    it('method exists and returns a promise', function() {

        expect(qfs.fileExists).to.exist
        expect(qfs.fileExists).to.be.instanceof(Function);

        var promise = qfs.fileExists('/etc/hosts');

        expect(promise.then).to.be.instanceof(Function);
        expect(promise.fail).to.be.instanceof(Function);

    }); 

    it('succeeded on existing file', function(done) {

        //var promise = qfs.fileExists('/etc/bind/named.conf.local');
        var promise = qfs.fileExists('/etc/hosts');
        promise.then(function(){
            done();
        });    

        promise.fail(function(){
            done(new Error('File don\'t exist'));
        })    

    }); 

    it('fails on not existing file', function(done) {

        //var promise = qfs.fileExists('/etc/bind/named.conf.local');
        var promise = qfs.fileExists('/etc/host');
        promise.then(function(){
            done(new Error('file don\'t exist'));
        });    

        promise.fail(function(){
            done();
        })    

    }); 

});