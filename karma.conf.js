// Karma configuration
// http://karma-runner.github.io/0.13/config/configuration-file.html
/* eslint-env node */

const makeWebpackConfig = require('./webpack.make');
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function (config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['mocha', 'chai', 'sinon-chai', 'chai-as-promised', 'chai-things'],

        client: {
            mocha: {
                timeout: 5000, // set default mocha spec timeout
            },
            captureConsole: true,
        },

        // list of files / patterns to load in the browser
        files: [
            {
                pattern: 'spec.js',
                watched: false,
            },
        ],

        preprocessors: {
            'spec.js': ['webpack'],
        },

        webpack: makeWebpackConfig({
            TEST: true,
        }),

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            noInfo: true,
        },

        plugins: [
            require('karma-mocha'),
            require('karma-chai-plugins'),
            // require('karma-coverage'),
            require('karma-chrome-launcher'),
            require('karma-firefox-launcher'),
            // require('karma-phantomjs-launcher'),
            // require('karma-script-launcher'),
            require('karma-webpack'),
            require('karma-sourcemap-loader'),
            require('karma-spec-reporter'),
            require('karma-mocha-reporter'),
            require('karma-spec-reporter'),
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 9001,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // reporter types:
        // - dots
        // - progress (default)
        // - spec (karma-spec-reporter)
        // - junit
        // - growl
        // - coverage
        // - mocha
        reporters: ['spec'],

        // specReporter: {
        //     maxLogLines: 5, // limit number of lines logged per test
        //     suppressErrorSummary: true, // do not print error summary
        //     suppressFailed: false, // do not print information about failed tests
        //     suppressPassed: false, // do not print information about passed tests
        //     suppressSkipped: true, // do not print information about skipped tests
        //     showSpecTiming: false, // print the time elapsed for each spec
        //     failFast: true, // test would finish with error when a first fail occurs.
        // },

        // coverageReporter: {
        //     reporters: [
        //         {
        //             type: 'html',
        //             subdir: 'client',
        //         },
        //         {
        //             type: 'json',
        //             subdir: '.',
        //             file: 'client-coverage.json',
        //         },
        //     ],
        //     dir: 'coverage/',
        // },

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - ChromeHeadless
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['ChromeHeadless'],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,
    });
};
