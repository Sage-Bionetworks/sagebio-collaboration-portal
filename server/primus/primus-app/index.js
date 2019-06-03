/**
 * Module dependencies.
 */
var app = require('./lib');

/**
 * Exporting modules.
 */
// exports.library = app.client.source;
// exports.client = app.client.client;
exports.server = app.server.server;
exports.app = app;
