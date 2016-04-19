var fs = require('fs');
var path = require('path');

var rmdirSync = function(dir) {

    var list = fs.readdirSync(dir);
    for(var i = 0, x = list.length; i < x; i++) {

        var filename = path.join(dir, list[i]);

        var stat = fs.statSync(filename);
        
        if(stat.isDirectory()) {
            
            rmdirSync(filename);

        } else {

            fs.unlinkSync(filename);

        }
    }

    fs.rmdirSync(dir);

};

module.exports = rmdirSync
