import passport from 'passport';
import {
    Strategy as GoogleStrategy
} from 'passport-google-oauth20';
import {
    some
} from 'lodash/fp';
var util = require('../util');

export function setup(User, Organization, config) {
    let googleConfig = {
        clientID: config.googleOAuth.clientID,
        clientSecret: config.googleOAuth.clientSecret,
        callbackURL: config.googleOAuth.callbackURL
    };
    passport.use(new GoogleStrategy(googleConfig,
        (accessToken, refreshToken, profile, done) => {

            const domain = profile.emails[0].value.split('@')[1];
            const userDataFromProvider = {
                name: profile.displayName,
                email: profile.emails[0].value,
                picture: profile._json.picture,
                provider: 'google-oauth20',
                'google-oauth20': profile._json,
                username: profile.emails[0].value.split('@')[0]
            };

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
