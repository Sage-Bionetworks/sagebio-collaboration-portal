import passport from 'passport';
import {
    OIDCStrategy
} from 'passport-azure-ad';
var util = require('../util');

export function setup(User, Organization, config) {
    const rocheAzureADConfig = {
        identityMetadata: config.rocheAzureAD.identityMetadata,
        clientID: config.rocheAzureAD.clientID,
        clientSecret: config.rocheAzureAD.clientSecret,
        redirectUrl: config.rocheAzureAD.redirectURL,
    };

    var strategy = new OIDCStrategy({
        identityMetadata: rocheAzureADConfig.identityMetadata,
        clientID: rocheAzureADConfig.clientID,
        clientSecret: rocheAzureADConfig.clientSecret,
        redirectUrl: rocheAzureADConfig.redirectUrl,
        scope: ['email', 'profile'],
        responseType: 'id_token',
        responseMode: 'form_post',
    }, (iss, sub, profile, done) => {
      const userDataFromProvider = {
          name: `${profile._json.given_name} ${profile._json.family_name}` || profile._json.name,
          email: profile._json.rsiMail || profile._json.email,
          provider: 'phccp',
          phccp: profile._json,
          username: profile._json.rsiUserID || profile.displayName,
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
          .then(util.saveUser(done))
          .catch(err => done(err));
    });

    passport.use('phccp', strategy);
}
