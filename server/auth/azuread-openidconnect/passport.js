import passport from 'passport';
import {
    OIDCStrategy
} from 'passport-azure-ad';
var util = require('../util');

export function setup(User, Organization, config) {
    const azureADConfig = {
        identityMetadata: config.azureADOpenIDConnect.identityMetadata,
        clientID: config.azureADOpenIDConnect.clientID,
        redirectUrl: config.azureADOpenIDConnect.redirectURL,
    };

    var strategy = new OIDCStrategy({
        identityMetadata: azureADConfig.identityMetadata,
        clientID: azureADConfig.clientID,
        // clientSecret: azureADConfig.clientSecret,
        scope: ['email', 'profile'],
        responseType: 'id_token',
        responseMode: 'form_post',
        // allowHttpForRedirectUrl: true,  // Set to true if redirectUrl is http and not an https address
        redirectUrl: azureADConfig.redirectUrl,
    }, (iss, sub, profile, done) => {
        const userDataFromProvider = {
            name: profile._json.name,
            email: profile._json.email,
            provider: 'azuread-openidconnect',
            'azuread-openidconnect': profile._json,
            username: profile._json.email,
        };
        const domain = userDataFromProvider.email.split('@')[1];

        Organization
            .findOne({
                domains: domain,
                active: true
            })
            .exec()
            .then(util.handleUnauthorizedOrganization(done))
            .then(util.createOrUpdateUser(User, userDataFromProvider))
            .then(util.giveInitAdminRole())
            .then(util.saveUser(done))
            .catch(err => done(err));
    });

    passport.use('azuread-openidconnect', strategy);
}
