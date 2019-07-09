/*eslint no-process-env:0*/

import fs from 'fs';

// Production specific configuration
// =================================
module.exports = {
    // Server IP
    ip: process.env.OPENSHIFT_NODEJS_IP ||
        process.env.ip ||
        undefined,

    // Server port
    port: process.env.OPENSHIFT_NODEJS_PORT ||
        process.env.PORT ||
        8080,

    // MongoDB connection options
    mongo: {
        useMongoClient: true,
        uri: process.env.MONGODB_URI ||
            process.env.MONGOHQ_URL ||
            process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME ||
            'mongodb://localhost/phccp'
    },

    https: {
        key: process.env.HTTPS_KEY || fs.readFileSync('certs/server.key'),
        cert: process.env.HTTPS_CERT || fs.readFileSync('certs/server.cert')
    },

    phccpShinyToolExample: {
        url: process.env.PHCCP_SHINY_TOOL_EXAMPLE_URL || 'https://phccp-shiny.synapse.org/master/app'
    }
};
