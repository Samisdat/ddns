'use strict';

var expect = require('chai').expect;

var fs = require('fs');
var notFs = require('not-fs');
var rmdir = require('../../grunt/lib/rmdir');

var config = require('../../grunt/lib/config');

describe('config ', function() {

    before(function(){
        notFs.swapIn();
    });

    after(function(){
        notFs.swapOut();
    });

    beforeEach(function() {

        if (true === fs.existsSync('/ddns/')){
            rmdir('/ddns/');
        }

        fs.mkdirSync('/ddns/');

    });

    it('can be created', function() {

        expect(config.setNameServer).to.be.instanceof(Function);
        expect(config.getNameServer).to.be.instanceof(Function);
        expect(config.getZones).to.be.instanceof(Function);
        expect(config.addZone).to.be.instanceof(Function);
        expect(config.removeZone).to.be.instanceof(Function);
        expect(config.getConfigFilePath).to.be.instanceof(Function);
        expect(config.getTplPath).to.be.instanceof(Function);

    });

    it('set/get nameserver', function() {

        config.reload();

        var exist = fs.existsSync(config.getConfigFilePath());
        expect(exist).to.be.false;

        expect(config.getNameServer()).to.be.undefined;

        //set
        config.setNameServer('ns.example.com');
        expect(config.getNameServer()).to.be.equal('ns.example.com');

        // after set the config data should be persisted
        exist = fs.existsSync(config.getConfigFilePath());
        expect(exist).to.be.true;

        //set
        config.setNameServer('ns.example.org');
        expect(config.getNameServer()).to.be.equal('ns.example.org');

        var configJson = fs.readFileSync(config.getConfigFilePath(), {encoding: 'utf8'});
        configJson = JSON.parse(configJson);

        expect(configJson.nameServer).to.be.equal('ns.example.org');

    });

    it('set/get keyName', function() {

        config.reload();

        var exist = fs.existsSync(config.getConfigFilePath());
        expect(exist).to.be.false;

        expect(config.getKeyName()).to.be.undefined;

        //set
        config.setKeyName('abcd');
        expect(config.getKeyName()).to.be.equal('abcd');

        // after set the config data should be persisted
        exist = fs.existsSync(config.getConfigFilePath());
        expect(exist).to.be.true;

        var configJson = fs.readFileSync(config.getConfigFilePath(), {encoding: 'utf8'});
        configJson = JSON.parse(configJson);

        expect(configJson.keyName).to.be.equal('abcd');

    });

    it('can get/add and remove zone', function() {

        config.reload();

        var exist = fs.existsSync(config.getConfigFilePath());
        expect(exist).to.be.false;

        expect(config.getZones()).to.deep.equal([]);

        //add
        expect(config.hasZone('dev.example.com')).to.be.false;
        config.addZone('dev.example.com');
        expect(config.getZones()).to.deep.equal(['dev.example.com']);
        expect(config.hasZone('dev.example.com')).to.be.true;

        // add duplicate
        config.addZone('dev.example.com');
        expect(config.getZones()).to.deep.equal(['dev.example.com']);

        // add second zone
        expect(config.hasZone('dev.example.org')).to.be.false;
        config.addZone('dev.example.org');
        expect(config.getZones()).to.deep.equal(['dev.example.com', 'dev.example.org']);
        expect(config.hasZone('dev.example.org')).to.be.true;

        // remove first one
        config.removeZone('dev.example.com');
        expect(config.getZones()).to.deep.equal(['dev.example.org']);
        expect(config.hasZone('dev.example.com')).to.be.false;


        var configJson = fs.readFileSync(config.getConfigFilePath(), {encoding: 'utf8'});
        configJson = JSON.parse(configJson);

        expect(configJson.zones).to.deep.equal(['dev.example.org']);


    });

    it('can deserialised config from file', function() {


        var json = {};
        json.nameServer = 'ns.example.org';
        json.zones = ['dev.example.org'];
        json.keyName = 'akeyname';
        json.tplPath = '/var/docker-ddns/tpls/';

        json = JSON.stringify(json);

        fs.writeFileSync(config.getConfigFilePath(), json, {encoding: 'utf8'});

        config.reload();

        expect(config.getNameServer()).to.be.equal('ns.example.org');
        expect(config.getZones()).to.deep.equal(['dev.example.org']);
        expect(config.getKeyName()).to.be.equal('akeyname');
        expect(config.getTplPath()).to.be.equal('/var/docker-ddns/tpls/');

    });

    it('can deserialised config from incomplete file', function() {


        var json = {};
        json.nameServer = 'ns.example.org';

        json = JSON.stringify(json);

        fs.writeFileSync(config.getConfigFilePath(), json, {encoding: 'utf8'});
        config.reload();

        expect(config.getNameServer()).to.be.equal('ns.example.org');
        expect(config.getZones()).to.deep.equal([]);
        expect(config.getTplPath()).to.be.equal('/ddns/tpls/');


    });


});
