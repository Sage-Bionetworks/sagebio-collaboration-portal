/*eslint no-process-env:0*/

// Test specific configuration
// ===========================
module.exports = {
    // MongoDB connection options
    mongo: {
        useMongoClient: true,
        uri: 'mongodb://localhost/phccp-test'
    },
    sequelize: {
        uri: 'sqlite://',
        options: {
            logging: false,
            operatorsAliases: false,
            storage: 'test.sqlite',
            define: {
                timestamps: false
            }
        }
    },
    port: '9001',

    authStrategies: [
        'local'
    ],

    phccpShinyToolExample: {
        url: process.env.PHCCP_SHINY_TOOL_EXAMPLE_URL || 'https://phccp-shiny.synapse.org/test/app'
    }
};
