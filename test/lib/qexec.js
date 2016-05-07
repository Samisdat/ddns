'use strict';

var expect = require('chai').expect;

var grunt = require('grunt');
var q = require('q');

var qexec = require('../../grunt/lib/qexec');

describe('promise exec ', function() {

    it('method exists and returns a promise', function() {

        expect(qexec).to.be.instanceof(Function);

        var promise = qexec(grunt.log, 'echo "hallo"');

        expect(q.isPromise(promise)).to.be.true;

    });

    it('succeeded on just echo hallo', function(done) {

        qexec(undefined, 'echo "hallo"', 'just an echo', 100, true)
        .then(function(response){

            expect(response.stdout).to.be.equal('hallo\n');
            expect(response.error).to.be.equal(null);
            expect(response.stderr).to.be.equal('');
            done();
        })
        .fail(function(){
            done(new Error(''));
        });

    });

    it('succeeded on just echo hallo with minimal parameters', function(done) {

        qexec(undefined, 'echo "hallo"')
        .then(function(response){

            expect(response.stdout).to.be.equal('hallo\n');
            expect(response.error).to.be.equal(null);
            expect(response.stderr).to.be.equal('');
            done();
        })
        .fail(function(){
            done(new Error(''));
        });

    });

    it('fail on unkown cmd', function(done) {

        qexec(undefined, 'unkown_cmd', 'just an echo', 100, true)
        .then(function(){
            done(new Error(''));
        })
        .fail(function(){
            done();
        });

    });

});
