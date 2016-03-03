module.exports = function(grunt){

    var mocha = {
        coverage: {
            src: 'test/**/*.js' // a folder works nicely
        },
        coverageSpecial: {
            src: ['testSpecial/*/*.js', 'testUnique/*/*.js'], // specifying file patterns works as well
            options: {
                coverageFolder: 'coverageSpecial',
                mask: '*.spec.js',
                mochaOptions: ['--harmony', '--async-only'], // any extra options
                istanbulOptions: ['--harmony', '--handle-sigint']
            }
        },
        coveralls: {
            src: ['test', 'testSpecial', 'testUnique'], // multiple folders also works
            options: {
                coverage: true, // this will make the grunt.event.on('coverage') event listener to be triggered
                check: {
                    lines: 75,
                    statements: 75
                },
                root: './lib', // define where the cover task should consider the root of libraries that are covered by tests
                reportFormats: ['cobertura', 'lcovonly']
            }
        }
    };
    /*
    'istanbul_check_coverage': {
        default: {
            options: {
                coverageFolder: 'coverage*', // will check both coverage folders and merge the coverage results
                check: {
                    lines: 80,
                    statements: 80
                }
            }
        }
    };
    */
    grunt.event.on('coverage', function(lcovFileContents, done){
        // Check below on the section "The coverage event"
        done();
    });

    return mocha;
};
