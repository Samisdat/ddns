var test = require('./test.js');
test();


var vfs = require('vfs');

var fs = require('fs');

console.log(fs.existsSync('/tmp/foo'));
test();