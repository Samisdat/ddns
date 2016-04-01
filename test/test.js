var fs = require('fs');

module.exports = function(){
    console.log(fs.existsSync('/tmp/foo'));
};