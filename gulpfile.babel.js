// Generated on 2019-03-20 using generator-angular-fullstack 5.0.0-rc.4
import _ from 'lodash';
import del from 'del';
import gulp from 'gulp';
import grunt from 'grunt';
import path from 'path';
import through2 from 'through2';
import gulpLoadPlugins from 'gulp-load-plugins';
import http from 'http';
import open from 'open';
import lazypipe from 'lazypipe';
import nodemon from 'nodemon';
import {
    Server as KarmaServer
} from 'karma';
import {
    protractor,
    webdriver_update
} from 'gulp-protractor';
import {
    Instrumenter
} from 'isparta';
import webpack from 'webpack';
import makeWebpackConfig from './webpack.make';

var plugins = gulpLoadPlugins();
var config;

const clientPath = 'client';
const serverPath = 'server';
const paths = {
    client: {
        assets: `${clientPath}/assets/**/*`,
        images: `${clientPath}/assets/images/**/*`,
        revManifest: `${clientPath}/assets/rev-manifest.json`,
        scripts: [
            `${clientPath}/**/!(*.spec|*.mock).ts`
        ],
        styles: [`${clientPath}/{app,components}/**/*.scss`],
        mainStyle: `${clientPath}/app/app.scss`,
        views: `${clientPath}/{app,components}/**/*.html`,
        mainView: `${clientPath}/app.html`,
        test: [`${clientPath}/{app,components}/**/*.{spec,mock}.ts`],
        e2e: ['e2e/**/*.spec.js']
    },
    server: {
        scripts: [
            `${serverPath}/**/!(*.spec|*.integration).js`,
            `!${serverPath}/config/local.env.sample.js`
        ],
        json: [`${serverPath}/{,**/}*.json`],
        swagger: [`${serverPath}/swagger/**/*.yaml`],
        test: {
            integration: [`${serverPath}/**/*.integration.js`, 'mocha.global.js'],
            unit: [`${serverPath}/**/*.spec.js`, 'mocha.global.js']
        }
    },
    karma: 'karma.conf.js',
    dist: 'dist'
};

/********************
 * Helper functions
 ********************/

function onServerLog(log) {
    console.log(plugins.util.colors.white('[') +
        plugins.util.colors.yellow('nodemon') +
        plugins.util.colors.white('] ') +
        log.message);
}

function checkAppReady(cb) {
    var options = {
        host: 'localhost',
        port: config.port
    };
    http
        .get(options, () => cb(true))
        .on('error', () => cb(false));
}

// Call page until first success
function whenServerReady(cb) {
    var serverReady = false;
    var appReadyInterval = setInterval(() =>
        checkAppReady((ready) => {
            if (!ready || serverReady) {
                return;
            }
            clearInterval(appReadyInterval);
            serverReady = true;
            cb();
        }),
        100);
}

/********************
 * Reusable pipelines
 ********************/

// About lazypipe and Gulp 4
// https://stackoverflow.com/a/40101404

let lintClientScripts = lazypipe()
    .pipe(plugins.tslint, {
        formatter: 'verbose'
    })
    .pipe(plugins.tslint.report, {
        emitError: false
    });

const lintClientTestScripts = lazypipe()
    .pipe(plugins.tslint, {
        formatter: 'verbose'
    })
    .pipe(plugins.tslint.report, {
        emitError: false
    });

let lintServerScripts = lazypipe()
    .pipe(plugins.eslint, `${serverPath}/.eslintrc`)
    .pipe(plugins.eslint.format);

let lintServerTestScripts = lazypipe()
    .pipe(plugins.eslint, {
        configFile: `${serverPath}/.eslintrc`,
        envs: [
            'node',
            'es6',
            'mocha'
        ]
    })
    .pipe(plugins.eslint.format);

let transpileServer = lazypipe()
    .pipe(plugins.sourcemaps.init)
    .pipe(plugins.babel, {
        plugins: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-transform-runtime'
        ]
    })
    .pipe(plugins.sourcemaps.write, '.');

let mocha = lazypipe()
    .pipe(plugins.mocha, {
        reporter: 'spec',
        timeout: 5000,
        require: [
            './mocha.conf'
        ]
    });

let istanbul = lazypipe()
    .pipe(plugins.istanbul.writeReports)
    .pipe(plugins.istanbulEnforcer, {
        thresholds: {
            global: {
                lines: 80,
                statements: 80,
                branches: 80,
                functions: 80
            }
        },
        coverageDirectory: './coverage',
        rootDirectory: ''
    });

/********************
 * Env
 ********************/

gulp.task('env:all', cb => {
    let localConfig;
    try {
        localConfig = require(`./${serverPath}/config/local.env`);
    } catch (e) {
        localConfig = {};
    }
    plugins.env({
        vars: localConfig
    });
    cb();
});
gulp.task('env:test', cb => {
    plugins.env({
        vars: {
            NODE_ENV: 'test'
        }
    });
    cb();
});
gulp.task('env:prod', cb => {
    plugins.env({
        vars: {
            NODE_ENV: 'production'
        }
    });
    cb();
});

/********************
 * Tasks
 ********************/

gulp.task('inject:scss', () => {
    return gulp.src(paths.client.mainStyle)
        .pipe(plugins.inject(
            gulp.src(_.union(paths.client.styles, ['!' + paths.client.mainStyle]), {
                read: false
            })
            .pipe(plugins.sort()), {
                transform: (filepath) => {
                    let newPath = filepath
                        .replace(`/${clientPath}/app/`, '')
                        .replace(`/${clientPath}/components/`, '../components/')
                        .replace(/_(.*).scss/, (match, p1, offset, string) => p1)
                        .replace('.scss', '');
                    return `@import '${newPath}';`;
                }
            }))
        .pipe(gulp.dest(`${clientPath}/app`));
});

gulp.task('inject',
    gulp.series(
        'inject:scss'
    ));

function webpackCompile(options, cb) {
    let compiler = webpack(makeWebpackConfig(options));

    compiler.run((err, stats) => {
        if (err) return cb(err);

        plugins.util.log(stats.toString({
            colors: true,
            timings: true,
            chunks: options.BUILD
        }));
        cb();
    });
}

gulp.task('webpack:dev', cb => webpackCompile({
    DEV: true
}, cb));
gulp.task('webpack:dist', cb => webpackCompile({
    BUILD: true
}, cb));
gulp.task('webpack:test', cb => webpackCompile({
    TEST: true
}, cb));

gulp.task('styles', () => {
    return gulp.src(paths.client.mainStyle)
        .pipe(styles())
        .pipe(gulp.dest('.tmp/app'));
});

gulp.task('transpile:server', () => {
    var toTranspile = _.union(paths.server.scripts, paths.server.json);
    return gulp.src(toTranspile)
        .pipe(transpileServer())
        .pipe(gulp.dest(`${paths.dist}/${serverPath}`));
});

gulp.task('lint:scripts:client', cb => {
    return gulp.src(_.union(
            paths.client.scripts,
            _.map(paths.client.test, blob => `!${blob}`)
        ))
        .pipe(lintClientScripts())
        .on('end', cb)
});

gulp.task('lint:scripts:server', cb => {
    return gulp.src(_.union(paths.server.scripts, _.map(paths.server.test, blob => '!' + blob)))
        .pipe(lintServerScripts())
        .on('end', cb)
});

gulp.task('lint:scripts',
    gulp.parallel(
        'lint:scripts:client',
        'lint:scripts:server'
    ));

// gulp.task('lint:scripts:clientTest', () => {
//     return gulp.src(paths.client.test)
//         .pipe(lintClientScripts());
// });
//
// gulp.task('lint:scripts:serverTest', () => {
//     return gulp.src(paths.server.test)
//         .pipe(lintServerTestScripts());
// });

gulp.task('jscs', () => {
    return gulp.src(_.union(paths.client.scripts, paths.server.scripts))
        .pipe(plugins.jscs())
        .pipe(plugins.jscs.reporter());
});

gulp.task('clean:tmp', () => del(['.tmp/**/*'], {
    dot: true
}));

gulp.task('start:client', cb => {
    return require('./webpack.server').start(config.clientPort).then(() => {
        open(`http://localhost:${config.clientPort}`);
        cb();
    });
});

gulp.task('start:server', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    config = require(`./${serverPath}/config/environment`);
    nodemon(`-w ${serverPath} ${serverPath}`)
        .on('log', onServerLog);
});

gulp.task('start:server:prod', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    config = require(`./${paths.dist}/${serverPath}/config/environment`);
    nodemon(`-w ${paths.dist}/${serverPath} ${paths.dist}/${serverPath}`)
        .on('log', onServerLog);
});

gulp.task('start:server:debug', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    config = require(`./${serverPath}/config/environment`);
    // nodemon(`-w ${serverPath} --debug=5858 --debug-brk ${serverPath}`)
    nodemon(`-w ${serverPath} --inspect --debug-brk ${serverPath}`)
        .on('log', onServerLog);
});

gulp.task('watch', () => {
    var testFiles = _.union(paths.client.test, paths.server.test.unit, paths.server.test.integration);

    plugins.watch(_.union(paths.server.scripts, testFiles))
        .pipe(plugins.plumber())
        .pipe(lintServerScripts());

    plugins.watch(_.union(paths.server.test.unit, paths.server.test.integration))
        .pipe(plugins.plumber())
        .pipe(lintServerTestScripts());
});

gulp.task('mocha:unit', () => {
    return gulp.src(paths.server.test.unit)
        .pipe(mocha());
});

gulp.task('mocha:integration', () => {
    return gulp.src(paths.server.test.integration)
        .pipe(mocha());
});

gulp.task('test:server', gulp.series(
    'env:all',
    'env:test',
    'mocha:unit',
    'mocha:integration'
));

gulp.task('coverage:pre', () => {
    return gulp.src(paths.server.scripts)
        // Covering files
        .pipe(plugins.istanbul({
            instrumenter: Instrumenter, // Use the isparta instrumenter (code coverage for ES6)
            includeUntested: true
        }))
        // Force `require` to return covered files
        .pipe(plugins.istanbul.hookRequire());
});

gulp.task('coverage:unit', () => {
    return gulp.src(paths.server.test.unit)
        .pipe(mocha())
        .pipe(istanbul())
    // Creating the reports after tests ran
});

gulp.task('coverage:integration', () => {
    return gulp.src(paths.server.test.integration)
        .pipe(mocha())
        .pipe(istanbul())
    // Creating the reports after tests ran
});

gulp.task('test:server:coverage', cb =>
    gulp.series(
        'coverage:pre',
        'env:all',
        'env:test',
        'coverage:unit',
        'coverage:integration',
        cb
    ));

// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update);

gulp.task('test:e2e',
    gulp.series(
        gulp.parallel(
            'webpack:dist',
            'env:all',
            'env:test',
            'start:server',
            'webdriver_update'
        ),
        () => {
            gulp.src(paths.client.e2e)
                .pipe(protractor({
                    configFile: 'protractor.conf.js',
                }))
                .on('error', e => {
                    throw e
                })
                .on('end', () => {
                    process.exit()
                });
        }
    ));

gulp.task('test:client', done => {
    new KarmaServer({
        configFile: `${__dirname}/${paths.karma}`,
        singleRun: true
    }, err => {
        done(err);
        process.exit(err);
    }).start();
});

gulp.task('test', gulp.series(
    'test:server',
    'test:client'
));

/********************
 * Build
 ********************/

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], {
    dot: true
}));

gulp.task('build:images', () => {
    return gulp.src(paths.client.images)
        .pipe(plugins.imagemin([
            plugins.imagemin.optipng({
                optimizationLevel: 5
            }),
            plugins.imagemin.jpegtran({
                progressive: true
            }),
            plugins.imagemin.gifsicle({
                interlaced: true
            }),
            plugins.imagemin.svgo({
                plugins: [{
                    removeViewBox: false
                }]
            })
        ]))
        .pipe(plugins.rev())
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/images`))
        .pipe(plugins.rev.manifest(`${paths.dist}/${paths.client.revManifest}`, {
            base: `${paths.dist}/${clientPath}/assets`,
            merge: true
        }))
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`));
});

gulp.task('revReplaceWebpack', function () {
    return gulp.src('dist/**/*.js')
        .pipe(plugins.revReplace({
            manifest: gulp.src(`${paths.dist}/${paths.client.revManifest}`)
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('copy:extras', () => {
    return gulp.src([
            `${clientPath}/favicon.ico`,
            `${clientPath}/robots.txt`,
            `${clientPath}/.htaccess`
        ], {
            dot: true
        })
        .pipe(gulp.dest(`${paths.dist}/${clientPath}`));
});

/**
 * turns 'bootstrap/fonts/font.woff' into 'bootstrap/font.woff'
 */
function flatten() {
    return through2.obj(function (file, enc, next) {
        if (!file.isDirectory()) {
            try {
                let dir = path.dirname(file.relative).split(path.sep)[0];
                let fileName = path.normalize(path.basename(file.path));
                file.path = path.join(file.base, path.join(dir, fileName));
                this.push(file);
            } catch (e) {
                this.emit('error', new Error(e));
            }
        }
        next();
    });
}
// gulp.task('copy:fonts:dev', () => {
//     return gulp.src('node_modules/{bootstrap,font-awesome}/fonts/*')
//         .pipe(flatten())
//         .pipe(gulp.dest(`${clientPath}/assets/fonts`));
// });
// gulp.task('copy:fonts:dist', () => {
//     return gulp.src('node_modules/{bootstrap,font-awesome}/fonts/*')
//         .pipe(flatten())
//         .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/fonts`));
// });

// gulp.task('plop', cb => cb());
// gulp.task('hello', cb => cb());
//
// var done = (cb) => {
//     console.log('calling cb');
//     cb();
// };
// gulp.task('my', gulp.series('plop', gulp.parallel('hello', 'plop')), done);

gulp.task('serve',
    gulp.series(
        gulp.parallel(
            'clean:tmp',
            'lint:scripts',
            'inject',
            // 'copy:fonts:dev',
            'env:all'
        ),
        // 'webpack:dev',
        gulp.parallel('start:server', 'start:client'),
        'watch'
    )
);

gulp.task('serve:debug', (cb) =>
    gulp.series(
        gulp.parallel(
            'clean:tmp',
            'lint:scripts',
            'inject',
            // 'copy:fonts:dev',
            'env:all'
        ),
        'webpack:dev',
        gulp.parallel(
            'start:server:debug',
            'start:client'
        ),
        'watch',
        cb
    ));

gulp.task('copy:assets', () => {
    return gulp.src([paths.client.assets, '!' + paths.client.images])
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`));
});

gulp.task('copy:server', () => {
    var serverFiles = _.union('package.json', paths.server.swagger);
    return gulp.src(serverFiles, {
            cwdbase: true
        })
        .pipe(gulp.dest(paths.dist));
});

gulp.task('build',
    gulp.series(
        gulp.parallel(
            'clean:dist',
            'clean:tmp'
        ),
        'inject',
        'transpile:server',
        'build:images',
        gulp.parallel(
            'copy:extras',
            'copy:assets',
            // 'copy:fonts:dist',
            'copy:server'
        ),
        'webpack:dist',
        'revReplaceWebpack'
    ));

gulp.task('serve:dist', cb =>
    gulp.series(
        'build',
        'env:all',
        'env:prod',
        gulp.parallel(
            'start:server:prod',
            'start:client'
        ),
        cb
    ));

/********************
 * Default task
 ********************/

gulp.task('default', (cb) =>
    gulp.series(
        'build',
        cb
    ));

/********************
 * Grunt ported tasks
 ********************/

grunt.initConfig({
    buildcontrol: {
        options: {
            dir: paths.dist,
            commit: true,
            push: true,
            connectCommits: false,
            message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
        },
        heroku: {
            options: {
                remote: 'heroku',
                branch: 'master'
            }
        },
        openshift: {
            options: {
                remote: 'openshift',
                branch: 'master'
            }
        }
    }
});

grunt.loadNpmTasks('grunt-build-control');

// gulp.task('buildcontrol:heroku', function (done) {
//     grunt.tasks(
//         ['buildcontrol:heroku'], //you can add more grunt tasks in this array
//         {
//             gruntfile: false
//         }, //don't look for a Gruntfile - there is none. :-)
//         function () {
//             done();
//         }
//     );
// });
// gulp.task('buildcontrol:openshift', function (done) {
//     grunt.tasks(
//         ['buildcontrol:openshift'], //you can add more grunt tasks in this array
//         {
//             gruntfile: false
//         }, //don't look for a Gruntfile - there is none. :-)
//         function () {
//             done();
//         }
//     );
// });
