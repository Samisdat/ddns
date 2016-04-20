'use strict';

var Config = function(jsonString) {

    if(undefined === jsonString){
        jsonString = '{}';
    }

    var json = JSON.parse(jsonString);

    this.nameServer = json.nameServer || undefined;
    this.zones = json.zones || [];

};

Config.prototype.setNameServer = function(nameServer){

    this.nameServer = nameServer;

};

Config.prototype.getNameServer = function(){

    return this.nameServer;

};

Config.prototype.getZones = function(){

    return this.zones;

};

Config.prototype.addZone = function(zone){

    var alreadyExists = false;

    for(var i = 0, x = this.zones.length; i < x; i += 1){
        if(zone === this.zones[i]){
            alreadyExists = true;
            break;
        }
    }

    if(true === alreadyExists){
        return;
    }
    
    this.zones.push(zone);

};

Config.prototype.removeZone = function(zone){

    var zones = [];

    for(var i = 0, x = this.zones.length; i < x; i += 1){

        if(zone === this.zones[i]){
            
            continue;

        }

        zones.push(this.zones[i]);
    }
    
    this.zones = zones;

};

module.exports = Config;
