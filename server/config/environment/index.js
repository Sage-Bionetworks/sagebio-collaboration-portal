/*eslint no-process-env:0*/

import path from 'path';
import _ from 'lodash';
import fs from 'fs';

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
        session: process.env.SESSION_SECRET || 'phccp-secret'
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
            reconnectInterval: 500, // in ms
        }
    },

    init: {
        admin: {
            email: process.env.APP_INIT_ADMIN_EMAIL || 'admin@sagebase.org',
            password: process.env.APP_INIT_ADMIN_PASSWORD || 'admin'
        },
        dbSeedName: process.env.APP_INIT_DB_SEED_NAME || ''
    },

    // List of auth strategies available
    authStrategies: [
        (process.env.AUTH_LOCAL === 'true') && 'local',
        (!!process.env.OAUTH_GOOGLE_ID || process.env.OAUTH_GOOGLE_ENABLED) && 'google-oauth20',
        (!!process.env.SAML_GOOGLE_ENTRY_POINT || process.env.SAML_GOOGLE_ENABLED) && 'google-saml',
        (!!process.env.AZUREAD_OPENIDCONNECT_CLIENT_ID | process.env.AZUREAD_OPENIDCONNECT_ENABLED) && 'azuread-openidconnect',
        (!!process.env.ROCHE_AZURE_AD_CLIENT_ID || process.env.ROCHE_AZURE_AD_ENABLED) && 'phccp'
    ].filter(Boolean),

    // Google OAuth 2.0 (server/auth/google-oauth20)
    googleOAuth: {
        clientID: process.env.OAUTH_GOOGLE_ID || 'id',
        clientSecret: process.env.OAUTH_GOOGLE_SECRET || 'secret',
        callbackURL: `${process.env.DOMAIN || ''}/auth/google-oauth20/callback`
    },

    // Google SAML (server/auth/google-saml)
    googleSaml: {
        protocol: process.env.PROTOCOL || 'https://',
        entryPoint: process.env.SAML_GOOGLE_ENTRY_POINT || 'entryPoint',
        issuer: process.env.SAML_GOOGLE_ISSUER || 'issuer',
        path: process.env.SAML_GOOGLE_PATH || '/auth/google-saml/callback',
    },

    // Microsoft Azure AD OpenID Connect
    azureADOpenIDConnect: {
        identityMetadata: process.env.AZUREAD_OPENIDCONNECT_IDENTITY_METADATA || 'identityMetadata',
        clientID: process.env.AZUREAD_OPENIDCONNECT_CLIENT_ID || 'clientID',
        redirectURL: `${process.env.DOMAIN || ''}/auth/azuread-openidconnect/callback` // must be HTTPS
    },

    // Roche Azure AD (server/auth/phccp)
    rocheAzureAD: {
        identityMetadata: process.env.ROCHE_AZURE_AD_IDENTITY_METADATA || 'identityMetadata',
        clientID: process.env.ROCHE_AZURE_AD_CLIENT_ID || 'clientID',
        clientSecret: process.env.ROCHE_AZURE_AD_CLIENT_SECRET || 'clientSecret',
        redirectURL: `${process.env.DOMAIN || ''}/auth/phccp/callback` // must be HTTPS
    },

    provenance: {
        apiServerUrl: process.env.PROVENANCE_API_SERVER_PROTOCOL + '://' +
            process.env.PROVENANCE_API_SERVER_IP + ':' +
            process.env.PROVENANCE_API_SERVER_PORT +
            process.env.PROVENANCE_API_SERVER_PATH ||
            ''
    }
};

// Enables MongoDB authentication
Object.assign(all.mongo.options,
    process.env.MONGODB_USER ? {
        user: process.env.MONGODB_USER
    } : null,
    process.env.MONGODB_PASSWORD ? {
        pass: process.env.MONGODB_PASSWORD
    } : null
);

// Configure MongoDB for TLS/SSL
Object.assign(all.mongo.options,
    process.env.MONGODB_SSL ? {
        ssl: process.env.MONGODB_SSL === 'true'
    } : false,
    process.env.MONGODB_SSL_VALIDATE ? {
        sslValidate: process.env.MONGODB_SSL_VALIDATE === 'true'
    } : false,
    process.env.MONGODB_SSL_CA ? {
        sslCA: process.env.MONGODB_SSL_CA
    } : null,
    process.env.MONGODB_SSL_KEY ? {
        sslKey: process.env.MONGODB_SSL_KEY
    } : null,
    process.env.MONGODB_SSL_CERT ? {
        sslCert: process.env.MONGODB_SSL_CERT
    } : null
);

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
    all,
    require('./shared').default,
    require(`./${process.env.NODE_ENV}.js`) || {});
