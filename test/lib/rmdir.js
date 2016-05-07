'use strict';

var expect = require('chai').expect;

var fs = require('fs');

var notFs = require('not-fs');

var rmdir = require('../../grunt/lib/rmdir');

describe('rmdir', function() {

    before(function(){
        notFs.swapIn();
    });

    after(function(){
        notFs.swapOut();
    });

    beforeEach(function() {

        if (true === fs.existsSync('/tmp/vfs-test/')){
            rmdir('/tmp/vfs-test/');
        }

        fs.mkdirSync('/tmp/vfs-test');
        fs.writeFileSync('/tmp/vfs-test/message-one.txt', 'Hello Node.js', 'utf8');
        fs.writeFileSync('/tmp/vfs-test/message-two.txt', 'Hello Node.js', 'utf8');
        fs.mkdirSync('/tmp/vfs-test/sub/');
        fs.writeFileSync('/tmp/vfs-test/sub/message.txt', 'Hello Node.js', 'utf8');

    });

    it('should remove a dir recursive', function() {

        var dirExists = fs.existsSync('/tmp/vfs-test/');
        expect(dirExists).to.be.true;

        rmdir('/tmp/vfs-test/');

        var dirExists = fs.existsSync('/tmp/vfs-test/');
        expect(dirExists).to.be.false;

    });

});
