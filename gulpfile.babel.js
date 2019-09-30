/* eslint-disable no-sync */
/* global require, process */

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import dotenv from 'dotenv';
import fs from 'fs';
import { union, map } from 'lodash';
import log from 'fancy-log';
import path from 'path';
import * as colors from 'ansi-colors';
import webpack from 'webpack';
import makeWebpackConfig from './webpack.make';
import lazypipe from 'lazypipe';
import nodemon from 'nodemon';
import through2 from 'through2';
import * as tslint from 'tslint';
import { Server as KarmaServer } from 'karma';
// eslint-disable-next-line camelcase
import { protractor, webdriver_update } from 'gulp-protractor';
import forge from 'node-forge';

var plugins = gulpLoadPlugins();
var config;

const clientPath = 'client';
const serverPath = 'server';
const configPath = 'config';
const certsPath = `${configPath}/certs`;
const paths = {
    client: {
        assets: `${clientPath}/assets/**/*`,
        images: `${clientPath}/assets/images/**/*`,
        revManifest: `${clientPath}/assets/rev-manifest.json`,
        scripts: [`${clientPath}/**/!(*.spec|*.mock).ts`],
        styles: [`${clientPath}/{app,components}/**/*.scss`],
        mainStyle: `${clientPath}/app/app.scss`,
        views: `${clientPath}/{app,components}/**/*.html`,
        mainView: `${clientPath}/app.html`,
        test: [`${clientPath}/{app,components}/**/*.{spec,mock}.ts`],
        e2e: ['e2e/**/*.spec.js'],
    },
    server: {
        scripts: [`${serverPath}/**/!(*.spec|*.integration|*.mock).js`, `!${serverPath}/config/local.env.sample.js`],
        json: [`${serverPath}/{,**/}*.json`],
        // swagger: [`${serverPath}/swagger/**/*.yaml`],
        test: {
            integration: [`${serverPath}/**/*.integration.js`, 'mocha.global.js'],
            unit: [`${serverPath}/**/*.spec.js`, 'mocha.global.js'],
        },
    },
    karma: 'karma.conf.js',
    dist: 'dist',
    config: {
        default: `${configPath}/default.env`,
        development: `${configPath}/development.env`,
        production: `${configPath}/production.env`,
    },
    // Certificates, private key and certificate authority are set using the
    // following files if their associated environment variable is not already set.
    certs: {
        serverSslCert: `${certsPath}/server.cert`,
        serverSslKey: `${certsPath}/server.key`,
        serverSslCA: `${certsPath}/server.ca`,
        mongodbSslCert: `${certsPath}/mongodb.cert`,
        mongodbSslKey: `${certsPath}/mongodb.key`,
        mongodbSslCA: `${certsPath}/mongodb.ca`,
        mongodbSslCertAndKey: `${certsPath}/mongodb.pem`, // used by mongodb service
    },
};

/********************
 * Helper functions
 ********************/

/**
 * Sets the env vars stored in the .env file specified.
 * @param {*} envFile
 */
const readConfig = envFile => {
    // https://www.npmjs.com/package/dotenv#what-happens-to-environment-variables-that-were-already-set
    const envConfig = dotenv.parse(fs.readFileSync(envFile));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
};

/**
 * Processes a log message generated by the server.
 * @param {*} msg
 */
const onServerLog = msg => {
    log(colors.white('[') + colors.yellow('nodemon') + colors.white('] ') + msg.message); // was console.log()
};

/**
 * Creates a config file (.env) from its sample (.sample.env).
 */
const createConfigFileFromSample = envFile => {
    let source = envFile.replace('.env', '.sample.env');
    let destination = envFile;
    log(`Copying ${source} to ${destination}`);
    fs.copyFile(source, destination, err => {
        if (err) throw err;
    });
};

/**
 * Generates X.509 certificate and RSA private key.
 *
 * The subject of the certificate has its attributes set to 'TBD'.
 */
const generateCertAndPrivateKey = () => {
    var pki = forge.pki;
    var keys = pki.rsa.generateKeyPair(4096);
    var cert = pki.createCertificate();

    // fill the required fields
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

    // use your own attributes here, or supply a csr (check the docs)
    var attrs = [
        {
            name: 'commonName',
            value: 'TBD',
        },
        {
            name: 'countryName',
            value: 'TBD',
        },
        {
            shortName: 'ST',
            value: 'TBD',
        },
        {
            name: 'localityName',
            value: 'TBD',
        },
        {
            name: 'organizationName',
            value: 'TBD',
        },
        {
            shortName: 'OU',
            value: 'TBD',
        },
    ];

    // here we set subject and issuer as the same one
    cert.setSubject(attrs);
    cert.setIssuer(attrs);

    // the actual certificate signing
    cert.sign(keys.privateKey);

    return {
        cert: pki.certificateToPem(cert),
        privateKey: forge.ssh.privateKeyToOpenSSH(keys.privateKey, ''),
    };
};

/********************
 * Reusable pipelines
 ********************/

/**
 * Lints Typescript files.
 */
const lintTs = () => {
    const program = tslint.Linter.createProgram('./tsconfig.json');
    return lazypipe()
        .pipe(
            plugins.tslint,
            {
                configuration: `${clientPath}/tslint.json`,
                fix: false,
                formatter: 'verbose',
                tslint,
                program,
            }
        )
        .pipe(
            plugins.tslint.report,
            {
                emitError: false,
            }
        );
};

/**
 * Lints Javascript scripts.
 */
const lintJs = lazypipe()
    .pipe(
        plugins.eslint,
        `${serverPath}/.eslintrc`
    )
    .pipe(plugins.eslint.format);

/**
 * Lints the server test scripts.
 */
const lintServerTestScripts = lazypipe()
    .pipe(
        plugins.eslint,
        {
            configFile: `${serverPath}/.eslintrc`,
            envs: ['node', 'es6', 'mocha'],
        }
    )
    .pipe(plugins.eslint.format);

/**
 * Transpiles the server files.
 */
const transpileServer = lazypipe()
    .pipe(plugins.sourcemaps.init)
    .pipe(
        plugins.babel, // reads .babelrc
        {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-runtime'],
        }
    )
    .pipe(
        plugins.sourcemaps.write,
        '.'
    );

/**
 * Runs Mocha on the files specified.
 */
const mocha = lazypipe().pipe(
    plugins.mocha,
    {
        reporter: 'spec',
        exit: true,
        timeout: 5000,
        require: ['./mocha.conf'],
    }
);

/********************
 * Env
 ********************/

/**
 * Sets the default env vars.
 */
gulp.task('env:default', done => {
    if (fs.existsSync(paths.config.default)) {
        readConfig(paths.config.default);
    }
    done();
});

/**
 * Sets the env vars specific to the development environment.
 */
gulp.task('env:dev', done => {
    process.env.NODE_ENV = 'development';
    if (fs.existsSync(paths.config.development)) {
        readConfig(paths.config.development);
    }
    done();
});

/**
 * Sets the env vars specific to the test environment.
 */
gulp.task('env:test', done => {
    process.env.NODE_ENV = 'test';
    done();
});

/**
 * Sets the env vars specific to the production environment.
 */
gulp.task('env:prod', done => {
    if (fs.existsSync(paths.config.production)) {
        readConfig(paths.config.production);
    }
    process.env.NODE_ENV = 'production';
    done();
});

/**
 * Sets the server SSL certificate, key, and certificate authority.
 */
gulp.task('env:ssl:server', done => {
    if (fs.existsSync(paths.certs.serverSslCert)) {
        process.env.SSL_CERT = fs.readFileSync(paths.certs.serverSslCert);
    }
    if (fs.existsSync(paths.certs.serverSslKey)) {
        process.env.SSL_KEY = fs.readFileSync(paths.certs.serverSslKey);
    }
    if (fs.existsSync(paths.certs.serverSslCA)) {
        process.env.SSL_CA = fs.readFileSync(paths.certs.serverSslCA);
    }
    done();
});

/**
 * Sets the MongoDB SSL certificate, key, and certificate authority.
 */
gulp.task('env:ssl:mongodb', done => {
    if (fs.existsSync(paths.certs.mongodbSslCert)) {
        process.env.MONGODB_SSL_CERT = fs.readFileSync(paths.certs.mongodbSslCert);
    }
    if (fs.existsSync(paths.certs.mongodbSslKey)) {
        process.env.MONGODB_SSL_KEY = fs.readFileSync(paths.certs.mongodbSslKey);
    }
    if (fs.existsSync(paths.certs.mongodbSslCA)) {
        process.env.MONGODB_SSL_CA = fs.readFileSync(paths.certs.mongodbSslCA);
    }
    done();
});

/**
 * Sets the SSL certificates and keys.
 */
gulp.task('env:ssl', gulp.series('env:ssl:server', 'env:ssl:mongodb'));

/********************
 * Clean tasks
 ********************/

/**
 * Removes the content of the dist folder.
 */
gulp.task('clean:dist', () =>
    del([`${paths.dist}/!(.git*|.openshift)**`], {
        dot: true,
    })
);

/**
 * Removes the content of the .tmp folder.
 */
gulp.task('clean:tmp', () =>
    del(['.tmp/**/*'], {
        dot: true,
    })
);

/********************
 * Tasks
 ********************/

/**
 * Creates the development config file from its sample.
 */
gulp.task('init:config:dev', done => {
    createConfigFileFromSample(paths.config.development);
    done();
});

/**
 * Creates the production config file from its sample.
 */
gulp.task('init:config:prod', done => {
    createConfigFileFromSample(paths.config.production);
    done();
});

/**
 * Creates configuration files from sample files.
 */
gulp.task('init:config', gulp.parallel('init:config:dev', 'init:config:prod'));

/**
 * Generates server X.509 certificate and private key
 */
gulp.task('init:ssl:server', done => {
    log('Generating server X.509 certificate and private key');
    const { cert, privateKey } = generateCertAndPrivateKey();

    fs.mkdirSync(certsPath, { recursive: true });

    log(paths.certs.serverSslCert);
    fs.writeFileSync(paths.certs.serverSslCert, cert);
    log(paths.certs.serverSslKey);
    fs.writeFileSync(paths.certs.serverSslKey, privateKey);

    log(colors.yellow('Please replace these files with your own in production environment.'));

    done();
});

/**
 * Generates MongoDB X.509 certificate and private key
 */
gulp.task('init:ssl:mongodb', done => {
    log('Generating MongoDB X.509 certificate and private key');
    const { cert, privateKey } = generateCertAndPrivateKey();

    fs.mkdirSync(certsPath, { recursive: true });

    log(paths.certs.mongodbSslCert);
    fs.writeFileSync(paths.certs.mongodbSslCert, cert);
    log(paths.certs.mongodbSslKey);
    fs.writeFileSync(paths.certs.mongodbSslKey, privateKey);
    log(paths.certs.mongodbSslCertAndKey);
    fs.writeFileSync(paths.certs.mongodbSslCertAndKey, `${cert}${privateKey}`);

    log(colors.yellow('Please replace these files with your own in production environment.'));

    done();
});

/**
 * Generates X.509 certificates and private keys.
 */
gulp.task('init:ssl', gulp.parallel('init:ssl:server', 'init:ssl:mongodb'));

/**
 * Runs initialization tasks.
 */
gulp.task('init', gulp.series('init:config', 'init:ssl'));

/**
 * Injects the style filenames into the client main style file.
 *
 * This function expects this placeholder to be commented in app.scss:
 *
 * inject:scss
 * endinject
 *
 * Reference: https://github.com/angular-fullstack/generator-angular-fullstack/blob/e8eb10563ea31e03b55dfd41976e566538be2cca/templates/app/gulpfile.babel.js#L207
 *
 * TODO: The boilerplate code does not come with the above placehold in app.scss.
 * Therefore, this function does not inject anything. Yet the app works. Yet the style
 * ends up in a .js after building the app. webpack.make.js has a plugin MiniCssExtractPlugin
 * whose purpose seems to be to extract css (and likely sass) code from JS file.
 * I'm not sure that it works properly. The current result is that the app.[hash].css
 * only contains information from the custom theme files while the html and scss
 * style files of the angular components are inserted inline into app.[hash].js.
 */
// gulp.task('inject:scss', () =>
//     gulp
//         .src(paths.client.mainStyle)
//         .pipe(
//             plugins.inject(
//                 gulp
//                     .src(union(paths.client.styles, [`!${paths.client.mainStyle}`]), {
//                         read: false,
//                     })
//                     .pipe(plugins.sort()),
//                 {
//                     transform: filepath => {
//                         let newPath = filepath
//                             .replace(`/${clientPath}/app/`, '')
//                             .replace(`/${clientPath}/components/`, '../components/')
//                             // eslint-disable-next-line no-unused-vars
//                             .replace(/_(.*).scss/, (match, p1, offset, string) => p1) // TODO: Remove theme files?
//                             .replace('.scss', '');
//                         return `@import '${newPath}';`;
//                     },
//                 }
//             )
//         )
//         .pipe(gulp.dest(`${clientPath}/app`))
// );

/**
 * Injects content into files.
 */
// gulp.task('inject', gulp.series('inject:scss'));

/**
 * Compiles the app using webpack.
 * @param {*} options
 * @param {*} cb
 */
const webpackCompile = (options, cb) => {
    let compiler = webpack(makeWebpackConfig(options));

    compiler.run((err, stats) => {
        if (err) return cb(err);

        log(
            stats.toString({
                colors: true,
                timings: true,
                chunks: options.BUILD,
            })
        );
        cb();
    });
};

/**
 * Builds the app with webpack for development.
 */
gulp.task('webpack:dev', cb =>
    webpackCompile(
        {
            DEV: true,
        },
        cb
    )
);

/**
 * Builds the app with webpack for production.
 */
gulp.task('webpack:dist', cb =>
    webpackCompile(
        {
            BUILD: true,
        },
        cb
    )
);

// /**
//  * Builds the app with webpack for testing.
//  */
// gulp.task('webpack:test', cb =>
//     webpackCompile(
//         {
//             TEST: true,
//         },
//         cb
//     )
// );

// gulp.task('styles', () =>
//     gulp
//         .src(paths.client.mainStyle)
//         .pipe(styles())
//         .pipe(gulp.dest('.tmp/app'))
// );

/**
 * Transpiles the server files.
 */
gulp.task('transpile:server', () => {
    var toTranspile = union(paths.server.scripts, paths.server.json);
    return gulp
        .src(toTranspile)
        .pipe(transpileServer())
        .pipe(gulp.dest(`${paths.dist}/${serverPath}`));
});

/**
 * Lints the client scripts.
 */
gulp.task('lint:client:ts', done =>
    gulp
        .src(union(paths.client.scripts, map(paths.client.test, blob => `!${blob}`)))
        .pipe(lintTs()())
        .on('end', done)
);

/**
 * Lints the client html files.
 */
gulp.task('lint:client:html', done =>
    gulp
        .src(paths.client.views)
        .pipe(plugins.htmlhint(`${clientPath}/htmlhint.json`))
        .pipe(plugins.htmlhint.reporter())
        // .pipe(plugins.htmlhint.failAfterError({ suppress: false })) // suppress doesn't seem to work
        .on('end', done)
);

/**
 * Lints the client scss files.
 */
gulp.task('lint:client:scss', done =>
    gulp
        .src(paths.client.styles)
        .pipe(
            plugins.stylelint({
                configFile: `${clientPath}/stylelint.json`,
                failAfterError: false,
                reporters: [{ formatter: 'string', console: true }],
            })
        )
        .on('end', done)
);

/**
 * Lints the server js files.
 */
gulp.task('lint:server:js', done =>
    gulp
        .src(union(paths.server.scripts, map(paths.server.test, blob => `!${blob}`)))
        .pipe(lintJs())
        .on('end', done)
);

/**
 * Lints the server test scripts.
 */
gulp.task('lint:server:test', done =>
    gulp
        .src(union(paths.server.test.integration, paths.server.test.unit))
        .pipe(lintServerTestScripts())
        .on('end', done)
);

/**
 * Lints the server files.
 */
gulp.task('lint:server', gulp.series('lint:server:js', 'lint:server:test'));

/**
 * Lints the client files.
 */
gulp.task('lint:client', gulp.series('lint:client:ts', 'lint:client:html', 'lint:client:scss'));

/**
 * Lints all the files.
 */
gulp.task('lint', gulp.parallel('lint:server', 'lint:client'));

/**
 * Starts the client using the Webpack Dev Server.
 */
gulp.task('start:client', done =>
    require('./webpack.server')
        .start(config.clientPort)
        .then(() => {
            done();
        })
);

/**
 * Starts the server in development environment.
 */
gulp.task('start:server:dev', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    config = require(`./${serverPath}/config/environment`);
    nodemon(`--inspect --trace-warnings -w ${serverPath} ${serverPath}`).on('log', onServerLog);
});

// /**
//  * Starts the server in test environment.
//  */
// gulp.task('start:server:test', () => {
//     process.env.NODE_ENV = process.env.NODE_ENV || 'test';
//     config = require(`./${serverPath}/config/environment`);
//     nodemon(`--trace-warnings ${serverPath}`).on('log', onServerLog);
// });

// /**
//  * Start the server in debug mode and development environment.
//  */
// gulp.task('start:server:dev:debug', () => {
//     process.env.NODE_ENV = process.env.NODE_ENV || 'development';
//     config = require(`./${serverPath}/config/environment`);
//     // nodemon(`-w ${serverPath} --debug=5858 --debug-brk ${serverPath}`)
//     nodemon(`-w ${serverPath} --inspect --debug-brk ${serverPath}`).on('log', onServerLog);
// });

/**
 * Starts the production server in production environment.
 */
gulp.task('start:server:dist', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    config = require(`./${paths.dist}/${serverPath}/config/environment`);
    nodemon(`-w ${paths.dist}/${serverPath} ${paths.dist}/${serverPath}`).on('log', onServerLog);
});

// gulp.task('watch', () => {
//     var testFiles = union(paths.client.test, paths.server.test.unit, paths.server.test.integration);

//     plugins
//         .watch(union(paths.server.scripts, testFiles))
//         .pipe(plugins.plumber())
//         .pipe(lintJs());

//     plugins
//         .watch(union(paths.server.test.unit, paths.server.test.integration))
//         .pipe(plugins.plumber())
//         .pipe(lintServerTestScripts());
// });

/**
 * Runs the server unit tests with Mocha.
 */
gulp.task('test:server:unit', () => gulp.src(paths.server.test.unit, { read: false }).pipe(mocha()));

/**
 * Runs the server integration tests with Mocha.
 */
gulp.task('test:server:integration', () => gulp.src(paths.server.test.integration).pipe(mocha()));

/**
 * Runs the server tests.
 */
gulp.task(
    'test:server',
    gulp.series('env:default', 'env:test', 'env:ssl', 'test:server:unit', 'test:server:integration')
);

/**
 * Downloads the selenium webdriver.
 */
gulp.task('webdriver_update', webdriver_update);

// TODO Server starts but nothing happens
gulp.task(
    'test:client:e2e',
    gulp.series('webpack:dist', 'env:default', 'env:test', 'env:ssl', 'start:server:dev', 'webdriver_update', () => {
        gulp.src(paths.client.e2e)
            .pipe(
                protractor({
                    configFile: 'protractor.conf.js',
                })
            )
            .on('error', e => {
                throw e;
            })
            .on('end', () => {});
    })
);

/**
 * Runs the client tests with Karma.
 */
gulp.task('test:client:karma', done => {
    new KarmaServer(
        {
            // eslint-disable-next-line no-undef
            configFile: `${__dirname}/${paths.karma}`,
            singleRun: true,
        },
        done
    ).start();
});

/**
 * Runs the client tests.
 */
gulp.task('test:client', gulp.series('test:client:karma'));

/**
 * Runs the server and client tests.
 */
gulp.task('test', gulp.series('test:server', 'test:client'));

/********************
 * Build
 ********************/

/**
 * Optimizes the images and adds static asset revisioning by appending content
 * hash to filenames.
 */
gulp.task('build:images', () =>
    gulp
        .src(paths.client.images)
        .pipe(
            plugins.imagemin([
                plugins.imagemin.optipng({
                    optimizationLevel: 5,
                }),
                plugins.imagemin.jpegtran({
                    progressive: true,
                }),
                plugins.imagemin.gifsicle({
                    interlaced: true,
                }),
                plugins.imagemin.svgo({
                    plugins: [
                        {
                            removeViewBox: false,
                        },
                    ],
                }),
            ])
        )
        .pipe(plugins.rev())
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/images`))
        .pipe(
            plugins.rev.manifest(`${paths.dist}/${paths.client.revManifest}`, {
                base: `${paths.dist}/${clientPath}/assets`,
                merge: true,
            })
        )
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`))
);

/**
 * Rewrites occurrences of filenames which have been renamed by gulp-rev.
 */
gulp.task('revReplaceWebpack', function () {
    return gulp
        .src('dist/**/*.js')
        .pipe(
            plugins.revReplace({
                manifest: gulp.src(`${paths.dist}/${paths.client.revManifest}`),
            })
        )
        .pipe(gulp.dest('dist'));
});

/**
 * Copies extra files such as favicon.ico, robots.txt, and .htaccess to the dist folder.
 */
gulp.task('copy:extras', () =>
    gulp
        .src([`${clientPath}/favicon.ico`, `${clientPath}/robots.txt`, `${clientPath}/.htaccess`], {
            dot: true,
        })
        .pipe(gulp.dest(`${paths.dist}/${clientPath}`))
);

/**
 *
 *
 * Example: turns 'bootstrap/fonts/font.woff' into 'bootstrap/font.woff'.
 */
const flatten = () =>
    through2.obj(function (file, enc, next) {
        if (!file.isDirectory()) {
            try {
                let dir = path.dirname(file.relative).split(path.sep)[0];
                let fileName = path.normalize(path.basename(file.path));
                file.path = path.join(file.base, path.join(dir, fileName));
                // eslint-disable-next-line no-invalid-this
                this.push(file);
            } catch (e) {
                // eslint-disable-next-line no-invalid-this
                this.emit('error', new Error('Unable to flatten filename', e));
            }
        }
        next();
    });

/**
 * Copies fonts to assets/fonts in development environment.
 */
gulp.task('copy:fonts:dev', () =>
    gulp
        .src('node_modules/{font-awesome}/fonts/*')
        .pipe(flatten())
        .pipe(gulp.dest(`${clientPath}/assets/fonts`))
);

/**
 * Copies fonts to assets/fonts when building the app.
 */
gulp.task('copy:fonts:dist', () =>
    gulp
        .src('node_modules/{font-awesome}/fonts/*')
        .pipe(flatten())
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/fonts`))
);

gulp.task(
    'serve:dev',
    gulp.series(
        'clean:tmp',
        // 'lint',
        // 'inject',
        'copy:fonts:dev',
        'env:default',
        'env:dev',
        'env:ssl',
        'webpack:dev',
        // start:client depends on start:server:dev for the generation of primus.js
        // in the rare occurence of an issue with empty primus.js, run start:server:dev
        // alone to regenerate primus.js before reusing this gulp task as it is.
        gulp.parallel('start:server:dev', 'start:client')
        // 'watch'
    )
);

// gulp.task('serve:debug', cb =>
//     gulp.series(
//         gulp.parallel(
//             'clean:tmp',
//             'lint',
//             'inject'
//             // 'copy:fonts:dev',
//             /*'env:all',*/
//         ),
//         'webpack:dev',
//         gulp.parallel('start:server:dev:debug', 'start:client'),
//         // 'watch',
//         cb
//     )
// );

/**
 * Copies the client assets but the images to the dist folder.
 */
gulp.task('copy:assets', () =>
    gulp.src([paths.client.assets, `!${paths.client.images}`]).pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`))
);

/**
 * Copies the files required to run the server.
 */
gulp.task('copy:server', () => {
    var serverFiles = ['package.json'];
    return gulp
        .src(serverFiles, {
            cwdbase: true,
        })
        .pipe(gulp.dest(paths.dist));
});

/**
 * Builds the app for distribution.
 */
gulp.task(
    'build',
    gulp.series(
        gulp.parallel('clean:dist', 'clean:tmp'),
        // 'inject',
        'transpile:server',
        'build:images',
        gulp.parallel('copy:extras', 'copy:assets', 'copy:fonts:dist', 'copy:server'),
        'webpack:dist',
        'revReplaceWebpack'
    )
);

/**
 * Starts the distribution server in production environment.
 */
gulp.task(
    'serve:dist',
    gulp.series('env:default', 'env:prod', 'env:ssl', 'start:server:dist') // gulp.parallel('start:server:dist', 'start:client')
);

/********************
 * Default task
 ********************/

gulp.task('default', gulp.series('lint', 'test', 'build'));

// gulp.series(gulp.parallel('lint', 'test'), 'build', gulp.parallel('watch', 'start'));
