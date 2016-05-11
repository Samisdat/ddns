/*global module */

var files = [
    'Gruntfile.js',
    'grunt/**/*.js',
    'test/**/*.js'
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
