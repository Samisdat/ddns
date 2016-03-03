var q = require('q');
var fs = require('fs');

var exists = function(){
    return 'hallo';
};

module.exports = {
    exists: exists
};