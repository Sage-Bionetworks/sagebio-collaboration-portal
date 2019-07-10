import passport from 'passport';
import {
    Strategy as SamlStrategy
} from 'passport-saml';
import {
    some
} from 'lodash/fp';
var util = require('../util');

export function setup(User, Organization, config) {
    const googleSamlConfig = {
        protocol: config.googleSaml.protocol,
        entryPoint: config.googleSaml.entryPoint,
        issuer: config.googleSaml.issuer,
        path: config.googleSaml.path,
    };

    passport.use(new SamlStrategy(googleSamlConfig,
        (profile, done) => {
            const userDataFromProvider = {
                name: `${profile.firstName} ${profile.lastName}`,
                email: profile.nameID,
                provider: 'google-saml',
                'google-saml': profile,
                username: profile.nameID,
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
        }));
}
