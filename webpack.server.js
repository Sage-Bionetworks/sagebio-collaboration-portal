/* global require */

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.make')({
    DEV: true,
});
const appConfig = require('./server/config/environment');
const devServerEntry = [
    `webpack-dev-server/client?https://localhost:${appConfig.clientPort}/`,
    'webpack/hot/dev-server',
];

config.entry.app = devServerEntry.concat(config.entry.app);

const compiler = webpack(config);

export const server = new WebpackDevServer(compiler, {
    ...config.devServer,
    hot: true
});

/**
 * Starts the dev server.
 * @returns {Promise}
 */
export function start() {
    return new Promise(resolve => {
        server.listen(appConfig.clientPort, 'localhost', resolve);
    });
}
