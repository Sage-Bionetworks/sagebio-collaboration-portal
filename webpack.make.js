/*eslint-env node*/

import { mapValues, mapKeys, merge } from 'lodash';

const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const SwaggerJSDocWebpackPlugin = require('swagger-jsdoc-webpack-plugin');
import fs from 'fs';

module.exports = function makeWebpackConfig(options) {
    /**
     * Environment type
     * BUILD is for generating minified builds
     * TEST is for generating test builds
     */
    const BUILD = !!options.BUILD;
    const TEST = !!options.TEST;
    const DEV = !!options.DEV;

    /**
     * Config
     * Reference: https://webpack.js.org/configuration/
     * This is the object where all configuration gets set
     */
    const config = {};

    config.mode = BUILD ? 'production' : 'development';

    /**
     * Entry
     * Reference: https://webpack.js.org/concepts/entry-points/
     * Should be an empty object if it's generating a test build
     * Karma will set this when it's a test build
     */
    if (!TEST) {
        config.entry = {
            polyfills: './client/app/polyfills.ts',
            app: './client/app/app.ts',
        };
    }

    /**
     * Output
     * Reference: https://webpack.js.org/configuration/output/
     * Should be an empty object if it's generating a test build
     * Karma will handle setting it up for you when it's a test build
     */
    if (TEST) {
        config.output = {};
    } else {
        config.output = {
            // Absolute output directory
            path: BUILD ? path.join(__dirname, '/dist/client/') : path.join(__dirname, '/.tmp/'),

            // Output path from the view of the page
            // Uses webpack-dev-server in development
            publicPath: '/',
            // publicPath: BUILD || DEV ? '/' : `http://localhost:${8081}/`,

            // Filename for entry points
            // Only adds hash in build mode
            filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',

            // Filename for non-entry points
            // Only adds hash in build mode
            chunkFilename: BUILD ? '[name].[hash].js' : '[name].bundle.js',
        };
    }

    config.resolve = {
        modules: ['node_modules'],
        extensions: ['.js', '.ts', '.scss'],
        alias: {
            primus: path.resolve(__dirname, 'client/components/socket/primus.js'),
            app: path.resolve(__dirname, 'client/app/'),
            components: path.resolve(__dirname, 'client/components/'),
            models: path.resolve(__dirname, 'shared/interfaces/'),
        },
    };

    if (TEST) {
        // for some reason the primus client and webpack don't get along in test
        config.resolve.alias.prmius = path.resolve(__dirname, 'client/components/socket/primus.mock.ts');
    }

    /**
     * Devtool
     * Reference: https://webpack.js.org/configuration/devtool/
     * Type of sourcemap to use per build type
     */
    if (TEST) {
        config.devtool = 'inline-source-map';
    } else if (BUILD || DEV) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval';
    }

    /**
     * Module
     * Reference: https://webpack.js.org/configuration/module/
     * List: https://webpack.js.org/loaders/
     * This handles most of the magic responsible for converting modules
     */
    config.module = {
        rules: [
            {
                // JS LOADER
                // Reference: https://webpack.js.org/loaders/babel-loader/
                // Reference: https://github.com/babel/babel-loader
                // Transpile .js files using babel-loader
                // Compiles ES6 and ES7 into ES5 code
                // Options are set using .babelrc
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
                include: [
                    path.resolve(__dirname, 'client/'),
                    path.resolve(__dirname, 'server/config/environment/shared.js'),
                    path.resolve(__dirname, 'node_modules/katex/dist/katex.min.js'),
                    path.resolve(__dirname, 'node_modules/quill/dist/quill.min.js'),
                    path.resolve(__dirname, 'node_modules/quill-mention/dist/quill.mention.min.js'),
                ],
            },
            {
                // TS LOADER
                // Reference: https://www.npmjs.com/package/ts-loader
                // Transpile .ts files using ts-loader
                test: /\.ts$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: path.resolve(__dirname, 'tsconfig.json'),
                        },
                    },
                ],
                include: [path.resolve(__dirname, 'client/'), path.resolve(__dirname, 'shared/interfaces/')],
            },
            {
                // ASSET LOADER
                // Reference: https://github.com/webpack/file-loader
                // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
                // Rename the file using the asset hash
                // Pass along the updated reference to your code
                // You can add here any file extension you want to get copied to your output
                // eslint-disable-next-line no-useless-escape
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)([\?]?.*)$/,
                use: 'file-loader',
            },
            {
                // HTML LOADER
                // Reference: https://webpack.js.org/loaders/html-loader/
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: false,
                    },
                },
            },
            {
                // CSS LOADER
                // Reference: https://github.com/webpack/css-loader
                // Allow loading css through js
                //
                // Reference: https://github.com/postcss/postcss-loader
                // Postprocess your css with PostCSS plugins
                test: /\.css$/,
                use: [DEV ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
                include: [
                    path.resolve(__dirname, 'node_modules/katex/dist/katex.min.css'),
                    path.resolve(__dirname, 'node_modules/quill/dist/*.css'),
                    path.resolve(__dirname, 'node_modules/quill-emoji/dist/quill-emoji.css'),
                    path.resolve(__dirname, 'node_modules/quill-mention/dist/quill.mention.min.css'),
                    path.resolve(__dirname, 'node_modules/quill-mention/src/quill.mention.css'), // because quill-mention use src instead of dist
                    path.resolve(__dirname, 'client/app/app.css'),
                ],
            },
            {
                // SASS LOADER
                // Reference: https://github.com/jtangelder/sass-loader
                test: /\.(scss|sass)$/,
                use: [
                    DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader?sourceMap',
                    'postcss-loader',
                    'sass-loader',
                ],
                include: [
                    // path.resolve(__dirname, 'node_modules/bootstrap-sass/assets/stylesheets/*.scss'),
                    path.resolve(__dirname, 'client/app/app.scss'),
                ],
            },
            {
                // SASS LOADER
                // Reference: https://github.com/jtangelder/sass-loader
                test: /\.(scss|sass)$/,
                use: ['to-string-loader?sourceMap', 'css-loader?sourceMap', 'postcss-loader', 'sass-loader?sourceMap'],
                include: [path.resolve(__dirname, 'client')],
                exclude: [/app\.scss$/],
            },
        ],
    };

    /**
     * Plugins
     * Reference: https://webpack.js.org/configuration/plugins/
     * List: https://webpack.js.org/plugins/
     */
    config.plugins = [
        // Hides the 'the request of a dependency is an expression' warnings
        new webpack.ContextReplacementPlugin(/angular(\\|\/)core/, path.resolve(__dirname, '../src')),

        // new webpack.LoaderOptionsPlugin({
        //     options: {
        //         context: __dirname,
        //     },
        //     sassLoader: {
        //         outputStyle: 'compressed',
        //         precision: 10,
        //         sourceComments: false,
        //     },
        // }),

        // Easily remove unused Moment.js locales when building with webpack
        // Reference: https://www.npmjs.com/package/moment-locales-webpack-plugin
        // To strip all locales except “en”
        new MomentLocalesPlugin(),

        // https://github.com/patsimm/swagger-jsdoc-webpack-plugin
        // This writes a swagger.json file in your output folder
        // DEV
        // new SwaggerJSDocWebpackPlugin({
        //     swaggerDefinition: require('server/config/swaggerDef.js'),
        //     apis: ['./server/**/api/**/index.js', './server/**/auth/**/*.js', './shared/interfaces/**/*.ts'],
        // }),
    ];

    if (BUILD) {
        config.plugins.push(
            new CompressionPlugin(),

            // Provides MiniCssExtractPlugin.loader used in css and scss loaders.
            // https://github.com/webpack-contrib/mini-css-extract-plugin
            new MiniCssExtractPlugin({
                filename: '[name].[hash].css',
                chunkFilename: '[id].[hash].css',
            })

            // Visualize size of webpack output files with an interactive zoomable treemap.
            // Reference: https://www.npmjs.com/package/webpack-bundle-analyzer
            // new BundleAnalyzerPlugin({
            //     generateStatsFile: true,
            // }),
        );
    }

    // Skip rendering app.html in test mode
    if (!TEST) {
        config.plugins.push(
            // Generates app.html from app.template.html
            // Reference; https://www.npmjs.com/package/html-webpack-plugin
            new HtmlWebpackPlugin({
                template: 'client/app.template.html',
                filename: '../client/app.html',
                alwaysWriteToDisk: true,
            }),

            // Enhances html-webpack-plugin functionality by adding the
            // {alwaysWriteToDisk: true|false} option.
            // Reference: https://www.npmjs.com/package/html-webpack-harddisk-plugin
            new HtmlWebpackHarddiskPlugin()
        );
    }

    // Get current commit during build based on a local git repository.
    // Reference: https://www.npmjs.com/package/git-revision-webpack-plugin
    var gitRevisionPlugin = new GitRevisionPlugin();

    // Set environment variables
    let env = {
        'process.env': {
            NODE_ENV: DEV ? '"development"' : BUILD ? '"production"' : TEST ? '"test"' : '"development"',
            GIT_VERSION: JSON.stringify(gitRevisionPlugin.version()),
            GIT_COMMIT_HASH: JSON.stringify(gitRevisionPlugin.commithash()),
            GIT_BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
        },
    };

    // Define free global variables.
    // Reference: https://webpack.js.org/plugins/define-plugin/
    config.plugins.push(new webpack.DefinePlugin(env));

    if (DEV) {
        config.plugins.push(
            // Enables Hot Module Replacement, otherwise known as HMR.
            // Reference: https://webpack.js.org/plugins/hot-module-replacement-plugin/
            new webpack.HotModuleReplacementPlugin(),

            // Easily remove unused Moment.js locales when building with webpack
            // Reference: https://www.npmjs.com/package/moment-locales-webpack-plugin
            // To strip all locales except “en”
            new MomentLocalesPlugin()
        );
    }

    config.cache = DEV;

    if (BUILD) {
        config.optimization = {
            splitChunks: {
                cacheGroups: {
                    styles: {
                        name: 'styles',
                        test: /\.css$/,
                        chunks: 'all',
                        enforce: true,
                    },
                },
            },
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true,
                }),
                new OptimizeCssAssetsPlugin({}),
            ],
        };
    }

    if (TEST) {
        config.stats = {
            colors: true,
            reasons: true,
        };
    }

    if (DEV) {
        /**
         * Dev server configuration
         * Reference: http://webpack.github.io/docs/configuration.html#devserver
         * Reference: http://webpack.github.io/docs/webpack-dev-server.html
         */
        const webpackAppConfig = {
            clientIp: process.env.CLIENT_IP || '0.0.0.0',
            clientPort: process.env.CLIENT_PORT || 8080,
            serverIp: process.env.IP || '0.0.0.0',
            serverPort: process.env.PORT || 9000,
            sslKey: process.env.SSL_KEY,
            sslCert: process.env.SSL_CERT,
            sslCA: process.env.SSL_CA,
        };

        config.devServer = {
            host: webpackAppConfig.clientIp,
            port: webpackAppConfig.clientPort,
            disableHostCheck: true, // not secure
            contentBase: './client/',
            hot: true,
            proxy: {
                '/api': {
                    target: `http://${webpackAppConfig.serverIp}:${webpackAppConfig.serverPort}`,
                    secure: false,
                },
                '/auth': {
                    target: `http://${webpackAppConfig.serverIp}:${webpackAppConfig.serverPort}`,
                    secure: false,
                },
                '/primus': {
                    target: `http://${webpackAppConfig.serverIp}:${webpackAppConfig.serverPort}`,
                    secure: false,
                    ws: true,
                    onError(err) {
                        console.log('Suppressing WDS proxy upgrade error:', err);
                    },
                },
            },
            stats: {
                modules: false,
                cached: false,
                colors: true,
                chunks: false,
            },
            historyApiFallback: {
                index: 'app.html',
            },
            http2: true,
            https: {
                key: webpackAppConfig.sslKey,
                cert: webpackAppConfig.sslCert,
                ca: webpackAppConfig.sslCA,
            },
        };
    }

    config.node = {
        global: true,
        process: true,
        crypto: false,
        clearImmediate: false,
        setImmediate: false,
    };

    return config;
};
