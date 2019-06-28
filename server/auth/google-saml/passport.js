import passport from 'passport';
import {
    Strategy as SamlStrategy
} from 'passport-saml';
import {
    some
} from 'lodash/fp';

export function setup(User, config) {
    // let demoAppConfig = {
    //     protocol: 'https://',
    //     // IdentityProvider (IdP) SAML SSO URL
    //     entryPoint: config.saml.entryPoint,
    //     // Service Provider (SP)
    //     issuer: config.saml.issuer, // Entity ID (https://.../sp)
    //     path: config.path, // Assertion Consumer Service (ACS) URL
    // };

    passport.use(new SamlStrategy({
        protocol: config.googleSaml.protocol,
        entryPoint: config.googleSaml.entryPoint,
        issuer: config.googleSaml.issuer,
        path: config.googleSaml.path,
    }, (profile, done) => {
        // Parse user profile data
        console.log('profile', profile);
        User
            .findOne({
                'google-saml.nameID': profile.nameID
            }).exec()
            .then(user => {
                const userDataFromProvider = {
                    name: `${profile.firstName} ${profile.lastName}`,
                    email: profile.nameID,
                    provider: 'google-saml',
                    'google-saml': profile,
                    username: profile.nameID,
                };

                if (user) {
                    user = Object.assign(user, userDataFromProvider);
                } else {
                    user = new User(userDataFromProvider);
                    user = Object.assign(user, {
                        role: 'user'
                    });
                }

                const authorizedEmails = config.userAccount.authorizedEmails;
                var authorized = some((regexp) => user.email.toLowerCase().match(regexp), authorizedEmails);
                if (!authorized) {
                    return done(null, null, 'Unauthorized email address');
                }

                return user.save()
                    .then(savedUser => done(null, savedUser))
                    .catch(err => done(err));
            })
            .catch(err => done(err));
    }));
}
