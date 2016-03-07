var qfs = require('../grunt/lib/qfs');

//qfs.fileExists('/etc/hosts').then(function(){console.log('yes');}).fail(function(){console.log('no');})

var memfs = require('memfs');
var mem = new memfs.Volume;
mem.mountSync('./', {
    "test.js": "console.log(123);",
    "dir/hello.js": "console.log('hello world');"
});

var unionfs = require('unionfs');
var fs = require('fs');

unionfs.use(mem);

unionfs.replace(fs);

qfs.fileExists('./test.js').then(function(){console.log('yes');}).fail(function(){console.log('no');})
qfs.fileExists('./test2.js').then(function(){console.log('yes');}).fail(function(){console.log('no');})