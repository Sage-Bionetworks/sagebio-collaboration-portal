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

    https: {
        key: process.env.HTTPS_KEY,
        cert: process.env.HTTPS_CERT
    },

    // Google OAuth 2.0 (server/auth/google)
    google: {
        clientID: process.env.GOOGLE_ID || 'id',
        clientSecret: process.env.GOOGLE_SECRET || 'secret',
        callbackURL: `${process.env.DOMAIN || ''}/auth/google/callback`
    },

    // Google SAML (server/auth/saml-demo)
    saml: {
        protocol: process.env.PROTOCOL || 'https://',
        entryPoint: process.env.SAML_ENTRY_POINT || 'entryPoint',
        issuer: process.env.SAML_ISSUER || 'issuer',
        path: process.env.SAML_PATH || 'path',
    },

    // Roche Azure AD (server/auth/phccp)
    rocheAzureAD: {
        identityMetadata: 'https://login.microsoftonline.com/c8036283-1408-4dc8-b870-31e789a0a528/.well-known/openid-configuration',
        clientID: '22880060-56fa-4993-bcc1-d1debcef4eb4',
        clientSecret: 'Br9G33QCdEiNDYT5u5utnEwVHCT+H3FGkYTm6gz4nOM=',
        redirectURL: `${process.env.DOMAIN || ''}/auth/phccp/callback` // must be HTTPS
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
