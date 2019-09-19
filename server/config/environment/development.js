/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {
    // MongoDB connection options
    mongo: {
        useMongoClient: true,
        uri: `${process.env.MONGODB_PROTOCOL}://${process.env.MONGODB_IP}:${process.env.MONGODB_PORT}${process.env.MONGODB_PATH}`,
    }
};
