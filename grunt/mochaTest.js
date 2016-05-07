var mocha = {
    options: {
        reporter: 'spec',
        captureFile: 'results.txt', // Optionally capture the reporter output to a file
        quiet: false, // Optionally suppress output to standard out (defaults to false)
        clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
    },
    all:{
        src: [    
            'test/lib/rmdir.js',
            'test/lib/qexec.js',
            'test/lib/qfs.js',
            'test/lib/config.js',
            'test/lib/server.js'
        ]        
    },
    server:{
        src: [    
            'test/lib/server.js'
        ]        
    },
    rmdir:{
        src: [    
            'test/lib/rmdir.js'
        ]        
    },
    config:{
        src: [    
            'test/lib/config.js'
        ]        
    }
};

module.exports = mocha;