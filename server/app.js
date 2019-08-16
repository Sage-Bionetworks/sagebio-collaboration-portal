/**
 * Main application file
 */

import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import config from './config/environment';
import http from 'http';
import initWebSocketServer from './config/websockets';
import expressConfig from './config/express';
import registerRoutes from './routes';
import { seedDatabaseIfNeeded, seedProvenanceIfNeeded } from './config/seed';
import https from 'https';

// Connect to MongoDB
console.log('MONGO URI', config.mongo.uri);
console.log('config.mongo.options', config.mongo.options);
const mongooseConnectionPromise = mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', err => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1); // eslint-disable-line no-process-exit
});

// Setup server
var app = express();
var server;
if (config.env === 'development' || config.env === 'test') {
    server = http.createServer(app);
} else {
    server = https.createServer({
        key: config.ssl.key,
        cert: config.ssl.cert
    }, app);
}

const wsInitPromise = initWebSocketServer(server);
expressConfig(app);
registerRoutes(app);

// Start server
function startServer() {
    app.angularFullstack = server.listen(config.port, config.ip, () => {
        console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
    });
}

wsInitPromise
    .then(primus => {
        app.primus = primus;
    })
    .then(() => mongooseConnectionPromise)
    .then(seedDatabaseIfNeeded)
    .then(seedProvenanceIfNeeded)
    .then(startServer)
    .catch(err => {
        console.log('Server failed to start due to error: %s', err);
    });

// Expose app
exports = module.exports = app;
