'use strict';

var fs = require('fs');

var config = (function() {

    var configFilePath = '/ddns/config.json';

    var nameServer;
    var zones = [];

    var tplPath = '/var/docker-ddns/tpls/';

    var load = function(){

        if(false === fs.existsSync(configFilePath)){
            nameServer = undefined;
            zones = [];
            tplPath = '/var/docker-ddns/tpls/';            
            return;
        }

        var json = fs.readFileSync(configFilePath, {encoding: 'utf8'});
        json = JSON.parse(json);
        
        nameServer = json.nameServer;
        
        if(json.zones === undefined){
            json.zones = [];
        }
        zones = json.zones;

        if(json.zones === undefined){
            json.zones = [];
        }
        tplPath = '/var/docker-ddns/tpls/';    

    };
    load();

    var persist = function(){

        var json = {};
        json.nameServer = nameServer;
        json.zones = zones;
        json.tplPath = tplPath;

        json = JSON.stringify(json);
        fs.writeFileSync(configFilePath, json,  {encoding: 'utf8'});

    };



    var setNameServer = function(newNameServer){

        nameServer = newNameServer;
        persist();

    };

    var getNameServer = function(){

        return nameServer;

    };

    var getZones = function(){

        return zones;

    };

    var hasZone = function(zone){

        var alreadyExists = false;

        for(var i = 0, x = zones.length; i < x; i += 1){
            if(zone === zones[i]){
                alreadyExists = true;
                break;
            }
        }

        return alreadyExists;

    };

    var addZone = function(zone){

        var alreadyExists = false;

        for(var i = 0, x = zones.length; i < x; i += 1){
            if(zone === zones[i]){
                alreadyExists = true;
                break;
            }
        }

        if(true === alreadyExists){
            return;
        }
        
        zones.push(zone);

        persist();

    };

    var removeZone = function(zone){

        var _zones = [];

        for(var i = 0, x = zones.length; i < x; i += 1){

            if(zone === zones[i]){
                
                continue;

            }

            _zones.push(zones[i]);
        }
        
        zones = _zones;
        persist();

    };

    var getConfigFilePath = function(){
        return configFilePath;
    };

    var getTplPath = function(){
        return tplPath;
    };

    return {
        reload: load,
        setNameServer: setNameServer,
        getNameServer: getNameServer,
        getZones: getZones,
        hasZone: hasZone,
        addZone: addZone,
        removeZone: removeZone,
        getConfigFilePath: getConfigFilePath,
        getTplPath: getTplPath
    };

})();

module.exports = config;
