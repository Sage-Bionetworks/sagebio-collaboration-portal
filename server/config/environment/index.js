/*eslint no-process-env:0*/

import path from 'path';
import _ from 'lodash';

/*function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}*/

// All configurations will extend these options
// ============================================
var all = {
    env: process.env.NODE_ENV,

    // Root path of server
    root: path.normalize(`${__dirname}/../../..`),

    // dev client port
    clientPort: process.env.CLIENT_PORT || 3000,

    // Server port
    port: process.env.PORT || 9000,

    // Server IP
    ip: process.env.IP || '0.0.0.0',

    // Secret for session, you will want to change this and make it an environment variable
    secrets: {
        session: 'phccp-secret'
    },

    // Lifetime for session
    expiresIn: {
        session: 6 * 60 * 60
    },

    // MongoDB connection options
    mongo: {
        options: {
            // https://mongoosejs.com/docs/deprecations.html
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            reconnectTries: 30,
            reconnectInterval: 500 // in ms
        }
    },

    google: {
        clientID: process.env.GOOGLE_ID || 'id',
        clientSecret: process.env.GOOGLE_SECRET || 'secret',
        callbackURL: `${process.env.DOMAIN || ''}/auth/google/callback`
    },

    saml: {
        entryPoint: process.env.SAML_ENTRY_POINT || 'entryPoint',
        issuer: process.env.SAML_ISSUER || 'issuer',
        apth: process.env.SAML_PATH || 'path',
    },

    userAccount: {
        authorizedEmails: [
            '@gene.com$',
            '@roche.com$',
            '@sagebase.org$'
        ]
    },

    provenance: {
        apiServerUrl: 'localhost:8081/prov/v1'
    }
};

// Add MongoDB credentials if specified
Object.assign(all.mongo.options,
    process.env.MONGODB_USER ? {
        user: process.env.MONGODB_USER
    } : null,
    process.env.MONGODB_PASS ? {
        pass: process.env.MONGODB_PASS
    } : null
);

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
    all,
    require('./shared').default,
    require(`./${process.env.NODE_ENV}.js`) || {});
