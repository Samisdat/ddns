'use strict';

var expect = require('chai').expect;

var q = require('q');
var fs = require('fs');
var notFs = require('not-fs');
var rmdir = require('../../grunt/lib/rmdir');

var Config = require('../../grunt/lib/config');

describe('config ', function() {

    before(function(){
        notFs.swapIn(); 
    });

    after(function(){
        notFs.swapOut(); 
    });

    beforeEach(function() {

        if(true === fs.existsSync('/ddns/')){
            rmdir('/ddns/');
        }

        fs.mkdirSync('/ddns/');
        
    });

    it('can be created', function() {

        var config = new Config();

        expect(config).to.be.instanceof(Config);
    });

    it('set/get nameserver', function() {

        var config = new Config();

        expect(config.getNameServer()).to.be.undefined;

        //set
        config.setNameServer('ns.example.com');        
        expect(config.getNameServer()).to.deep.equal('ns.example.com');

        //set
        config.setNameServer('ns.example.org');        
        expect(config.getNameServer()).to.deep.equal('ns.example.org');

    });    

    it('can get/add and remove zone', function() {

        var config = new Config();

        expect(config.getZones()).to.deep.equal([]);

        //add
        config.addZone('dev.example.com');        
        expect(config.getZones()).to.deep.equal(['dev.example.com']);

        // add duplicate
        config.addZone('dev.example.com');        
        expect(config.getZones()).to.deep.equal(['dev.example.com']);

        // add second zone
        config.addZone('dev.example.org');        
        expect(config.getZones()).to.deep.equal(['dev.example.com', 'dev.example.org']);

        // remove first one
        config.removeZone('dev.example.com');        
        expect(config.getZones()).to.deep.equal(['dev.example.org']);

    });

    it('can be (de)serialised from/to json', function() {
        
        var configA = new Config();

        configA.setNameServer('ns.example.com');        
        configA.addZone('dev.example.com');        
        configA.addZone('dev.example.org');

        var jsonString = JSON.stringify(configA);

        var configB = new Config(jsonString);

        expect(configA).to.deep.equal(configB);

    });

});
