/*eslint no-process-env:0*/

// Test specific configuration
// ===========================
module.exports = {
    // MongoDB connection options
    mongo: {
        useMongoClient: true,
        uri: 'mongodb://localhost/phccp-test',
        // options: {
        //     // useUnifiedTopology: false, // true leads to MongoTimeoutError
        // }
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
    ]
};
