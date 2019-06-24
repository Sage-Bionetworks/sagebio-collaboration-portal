/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {
    // MongoDB connection options
    mongo: {
        useMongoClient: true,
        uri: process.env.MONGODB_URI || 'mongodb://localhost/phccp'
    },

    phccpShinyToolExample: {
        url: process.env.PHCCP_SHINY_TOOL_EXAMPLE_URL || 'https://phccp-shiny.synapse.org/develop/app'
    }
};
