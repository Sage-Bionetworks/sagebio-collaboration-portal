/*eslint no-process-env:0*/

import fs from 'fs';

// Production specific configuration
// =================================
module.exports = {
    // Server IP
    ip: process.env.OPENSHIFT_NODEJS_IP || process.env.ip || undefined,

    // Server port
    port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080,

    // MongoDB connection options
    mongo: {
        useMongoClient: true,
        uri: `${process.env.MONGODB_PROTOCOL}://${process.env.MONGODB_IP}:${process.env.MONGODB_PORT}${process.env.MONGODB_PATH}`,
    },

    ssl: {
        key: process.env.SSL_KEY || '',
        cert: process.env.SSL_CERT || '',
    },
};
