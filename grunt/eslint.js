/*global module */

var files = [
    'grunt/lib/client.js',
    'grunt/lib/config.js',
    'grunt/lib/qexec.js',
    'grunt/lib/qfs.js',
    'grunt/lib/rmdir.js',
    'grunt/lib/server.js',

    'test/lib/config.js',
    'test/lib/qexec.js',
    'test/lib/qfs.js',
    'test/lib/rmdir.js',
    'test/lib/server.js'
];

var eslint = {
    lint:{
        src: files
    },
    lintAndFix:{
        options:{
            fix: true
        },
        src: files    
    }
};



module.exports = eslint;
