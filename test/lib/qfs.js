'use strict';

var expect = require('chai').expect;

var fs = require('fs');
var notFs = require('not-fs');
var path = require('path');

var qfs = require('../../grunt/lib/qfs');

notFs.swapIn(); 

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

describe('method qfs.fileExists', function() {

    beforeEach(function() {

        if(true === fs.existsSync('/vfs-test/')){
            rmdir('/vfs-test/');
        }

        fs.mkdirSync('/vfs-test');
        fs.mkdirSync('/vfs-test/exist');
        fs.writeFileSync('/vfs-test/message.txt', 'Hello Node.js', 'utf8');
    });

    it('method exists and returns a promise', function() {

        expect(qfs.fileExists).to.exist;
        expect(qfs.fileExists).to.be.instanceof(Function);

        var promise = qfs.fileExists('/vfs-test/message.txt');

        expect(promise.then).to.be.instanceof(Function);
        expect(promise.fail).to.be.instanceof(Function);
        expect(promise.fin).to.be.instanceof(Function);

    });

    it('succeeded on existing file', function(done) {

        //var promise = qfs.fileExists('/etc/bind/named.conf.local');
        var promise = qfs.fileExists('/vfs-test/message.txt');
        promise.then(function(){
            done();
        });

        promise.fail(function(){
            done(new Error('File don\'t exist'));
        });

    });

    it('fails on not existing file', function(done) {

        //var promise = qfs.fileExists('/etc/bind/named.conf.local');
        var promise = qfs.fileExists('/vfs-test/not-existing.txt');
        promise.then(function(){
            done(new Error('file exists'));
        });

        promise.fail(function(){
            done();
        });

    });

    it('fails when file name is not a string', function(done) {

        //var promise = qfs.fileExists('/etc/bind/named.conf.local');
        var promise = qfs.fileExists();
        promise.then(function(){
            done(new Error('file don\'t exist'));
        });

        promise.fail(function(){
            done();
        });

    });

});

describe('method qfs.unlink', function() {

    var qfs;

    beforeEach(function() {
        var vfs = createVirtualFileSystem();
        qfs = require('../../grunt/lib/qfs')(vfs);
    });

    it('succeeded an existing file', function(done) {

        //var promise = qfs.fileExists('/etc/bind/named.conf.local');
        var promise = qfs.unlink('/etc/bind/named.conf.local');
        promise.then(function(){
            done();
        });

        promise.fail(function(){
            done(new Error('File don\'t exist'));
        });

    });

    it('fails on not existing file', function(done) {

        //var promise = qfs.fileExists('/etc/bind/named.conf.local');
        var promise = qfs.unlink('/etc/bind/named.conf.loca');
        promise.then(function(){
            done(new Error('file exists'));
        });

        promise.fail(function(){
            done();
        });

    });

    it('fails when file name is not a string', function(done) {

        //var promise = qfs.fileExists('/etc/bind/named.conf.local');
        var promise = qfs.unlink();
        promise.then(function(){
            done(new Error('file don\'t exist'));
        });

        promise.fail(function(){
            done();
        });

    });


});

describe('method qfs.readFile', function() {

    var qfs;

    beforeEach(function() {
        var vfs = createVirtualFileSystem();
        qfs = require('../../grunt/lib/qfs')(vfs);
    });

    it('succeeded read existing file', function(done) {

        //qfs = require('../../grunt/lib/qfs')();
        var promise = qfs.readFile('/etc/bind/named.conf.local');
        promise.then(function(data){
            if ('just a file' !== data){
                done(new Error('read wrong content'));
                return;
            }
            done();
        });

        promise.fail(function(){
            done(new Error('File not written'));
        });

    });

    it('fail read a not existing file', function(done) {

        //qfs = require('../../grunt/lib/qfs')();
        var promise = qfs.readFile('/etc/bind/not-a-file', 'data');
        promise.then(function(){
            done(new Error('file don\'t exist'));
        });

        promise.fail(function(){
            done();
        });

    });

});


describe('method qfs.writeFile', function() {

    var qfs;

    beforeEach(function() {
        var vfs = createVirtualFileSystem();
        qfs = require('../../grunt/lib/qfs')(vfs);
    });

    it('succeeded write a new file', function(done) {

        //qfs = require('../../grunt/lib/qfs')();
        var promise = qfs.writeFile('/etc/bind/foobar', 'some data');
        promise.then(function(){

            qfs.readFile('/etc/bind/foobar').then(function(data){
                if ('some data' !== data){
                    done(new Error('read wrong content'));
                    return;
                }
                done();
            });

        });

        promise.fail(function(){
            done(new Error('File not written'));
        });

    });

    it('fail write a file outside mounted dir', function(done) {

        //qfs = require('../../grunt/lib/qfs')();
        var promise = qfs.writeFile('/tmp/bla', 'data');
        promise.then(function(){
            done(new Error('file don\'t exist'));
        });

        promise.fail(function(){
            done();
        });

    });

});

describe('method qfs.appendFile', function() {

    var qfs;

    beforeEach(function() {
        var vfs = createVirtualFileSystem();
        qfs = require('../../grunt/lib/qfs')(vfs);
    });

    it('succeeded appending to a file', function(done) {

        var promise = qfs.appendFile('/etc/bind/named.conf.local', ' append some more content');
        promise.then(function(){

            qfs.readFile('/etc/bind/named.conf.local').then(function(data){

                if ('just a file append some more content' !== data){
                    done(new Error('read wrong content'));
                    return;
                }
                done();
            });

        });

        promise.fail(function(){
            done(new Error('File not written'));
        });

    });

    it('fail appending to a file outside mounted dir', function(done) {

        //qfs = require('../../grunt/lib/qfs')();
        var promise = qfs.appendFile('/tmp/bla', 'data');
        promise.then(function(){
            done(new Error('file don\'t exist'));
        });

        promise.fail(function(){
            done();
        });

    });

});

describe('method qfs.rename', function() {

    var qfs;

    beforeEach(function() {
        var vfs = createVirtualFileSystem();
        qfs = require('../../grunt/lib/qfs')(vfs);
    });

    it('succeeded renaming file', function(done) {

        var promise = qfs.rename('/etc/bind/named.conf.local', '/etc/bind/named.conf.local.bac');
        promise.then(function(){

            qfs.fileExists('/etc/bind/named.conf.local.bac').then(function(){
                done();
            }).fail(function(){
                done(new Error('renamed file does not exist'));
            });

        });

        promise.fail(function(){
            done(new Error('rename file failed'));
        });

    });

    it('fail appending to a file outside mounted dir', function(done) {

        //qfs = require('../../grunt/lib/qfs')();
        var promise = qfs.appendFile('/tmp/bla', '/tmp/foo');
        promise.then(function(){
            done(new Error('should not work'));
        });

        promise.fail(function(){
            done();
        });

    });

});

