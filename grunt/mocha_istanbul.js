'use strict';

var mochaIstanbul = {
    all: {
        src: [
            'test/lib/rmdir.js',
            'test/lib/qexec.js',
            'test/lib/qfs.js',
            'test/lib/config.js',
            'test/lib/server.js'
        ]
    },
    server: {
        src: [
            'test/lib/server.js'
        ]
    },
    rmdir: {
        src: [
            'test/lib/rmdir.js'
        ]
    },
    config: {
        src: [
            'test/lib/config.js'
        ]
    }
};

module.exports = mochaIstanbul;
