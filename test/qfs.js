var expect = require('chai').expect;
var assert = require('chai').assert;

var qfs = require('../grunt/lib/qfs');

describe('qfs', function() { 

    it('can has method exists', function() {

        expect(qfs.exists).to.exist
        expect(qfs.exists).to.be.instanceof(Function);

    }); 

});
