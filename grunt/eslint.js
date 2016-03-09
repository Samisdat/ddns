/*global module */

var files = [
    'grunt/lib/qfs.js',
    'test/qfs.js'
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
