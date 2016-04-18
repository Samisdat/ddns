'use strict';

var expect = require('chai').expect;

var q = require('q');
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
describe('promise filesystem ', function() {

    after(function(){
        notFs.swapOut(); 
    });

    beforeEach(function() {

        if(true === fs.existsSync('/vfs-test/')){
            rmdir('/vfs-test/');
        }

        fs.mkdirSync('/vfs-test');
        fs.mkdirSync('/vfs-test/exist');
        fs.writeFileSync('/vfs-test/message.txt', 'Hello Node.js', 'utf8');
    });

    describe('method qfs.fileExists', function() {

        it('method exists and returns a promise', function() {

            expect(qfs.fileExists).to.be.instanceof(Function);

            var promise = qfs.fileExists('/vfs-test/message.txt');

            expect(q.isPromise(promise)).to.be.true;

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

    describe('method qfs.mkdir', function() {

        it('method exists and returns a promise', function() {

            expect(qfs.mkdir).to.be.instanceof(Function);

            var promise = qfs.mkdir('/vfs-test/foobar');

            expect(q.isPromise(promise)).to.be.true;

        });

        it('create a dir', function(done) {

            var exist = fs.existsSync('/vfs-test/foobar');
            expect(exist).to.be.false;

            expect(qfs.mkdir).to.be.instanceof(Function);

            qfs.mkdir('/vfs-test/foobar')
            .then(function(){

                var exist = fs.existsSync('/vfs-test/foobar');
                expect(exist).to.be.true;
                done();

            });

        });

    });

    describe('method qfs.readdir', function() {

        it('method exists and returns a promise', function() {

            expect(qfs.readdir).to.be.instanceof(Function);

            var promise = qfs.readdir('/vfs-test/');

            expect(q.isPromise(promise)).to.be.true;

        });

        it('read a dir', function(done) {

            var exist = fs.existsSync('/vfs-test/');
            expect(exist).to.be.true;

            qfs.readdir('/vfs-test/')
            .then(function(files){

                expect(files).to.deep.equal([ 'exist', 'message.txt' ]);
                done();

            });

        });

    });



    describe('method qfs.unlink', function() {

        it('method exists and returns a promise', function() {

            expect(qfs.unlink).to.be.instanceof(Function);

            var promise = qfs.unlink('/vfs-test/message.txt');

            expect(q.isPromise(promise)).to.be.true;

        });

        it('succeeded an existing file', function(done) {

            var exist = fs.existsSync('/vfs-test/message.txt');
            expect(exist).to.be.true;

            var promise = qfs.unlink('/vfs-test/message.txt');
            promise.then(function(){
                done();
            });

            promise.fail(function(){
                done(new Error('File don\'t exist'));
            });

        });

        it('fails on not existing file', function(done) {

            var promise = qfs.unlink('/vfs-test/not-exist.txt');
            promise.then(function(){
                done(new Error('file exists'));
            });

            promise.fail(function(){
                done();
            });

        });

        it('fails when failing to unlink existing file', function(done) {

                
            notFs.setForce('unlink', function(notFs){
                return 'MOCK';
            });

            var promise = qfs.unlink('/vfs-test/message.txt');
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

        it('method exists and returns a promise', function() {

            expect(qfs.readFile).to.be.instanceof(Function);

            var promise = qfs.readFile('/vfs-test/message.txt');

            expect(q.isPromise(promise)).to.be.true;

        });

        it('succeeded read existing file', function(done) {

            //qfs = require('../../grunt/lib/qfs')();
            var promise = qfs.readFile('/vfs-test/message.txt');
            promise.then(function(data){

                if ('Hello Node.js' !== data){
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
            var promise = qfs.readFile('/vfs-test/not-exist.txt');
            promise.then(function(){
                done(new Error('file don\'t exist'));
            });

            promise.fail(function(){
                done();
            });

        });

    });


    describe('method qfs.writeFile', function() {

        it('succeeded write a new file', function(done) {

            //qfs = require('../../grunt/lib/qfs')();
            var promise = qfs.writeFile('/vfs-test/new-file.txt', 'some data');
            promise.then(function(){

                qfs.readFile('/vfs-test/new-file.txt').then(function(data){
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

    });

    describe('method qfs.appendFile', function() {

        it('succeeded appending to a file', function(done) {

            var promise = qfs.appendFile('/vfs-test/message.txt', ' append some more content');
            promise.then(function(){

                qfs.readFile('/vfs-test/message.txt').then(function(data){

                    if ('Hello Node.js append some more content' !== data){
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

    });

    describe('method qfs.rename', function() {

        it('succeeded renaming file', function(done) {

            var promise = qfs.rename('/vfs-test/message.txt', '/vfs-test/message.txt.bac');
            promise.then(function(){

                qfs.fileExists('/vfs-test/message.txt.bac').then(function(){
                    done();
                }).fail(function(){
                    done(new Error('renameenamed file does not exist'));
                });

            });

            promise.fail(function(){
                done(new Error('rename file failed'));
            });

        });

    });

});
