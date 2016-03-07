var unionfs = require('unionfs');
var memfs = require('memfs');
var fs = require('fs');
var mem = new memfs.Volume;
mem.mountSync('/test/dir/dir2', {
    "test.js": "console.log(123);",
    "dir/hello.js": "console.log('hello world');",
    "dir/more/hello.js": "console.log('hello world');",
var expect = require('chai').expect;
var assert = require('chai').assert;

var qfs = require('../grunt/lib/qfs');

describe('qfs', function() { 

    it('can has method exists', function() {

        expect(qfs.exists).to.exist
        expect(qfs.exists).to.be.instanceof(Function);

    }); 

});
