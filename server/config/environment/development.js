/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {
    // MongoDB connection options
    mongo: {
        useMongoClient: true,
        uri: process.env.MONGODB_URI || 'mongodb://localhost/phccp'
    },

    https: {
        key: process.env.HTTPS_KEY || fs.readFileSync('certs/server.key'),
        cert: process.env.HTTPS_CERT || fs.readFileSync('certs/server.cert')
    },

    phccpShinyToolExample: {
        url: process.env.PHCCP_SHINY_TOOL_EXAMPLE_URL || 'https://phccp-shiny.synapse.org/develop/app'
    }
};
