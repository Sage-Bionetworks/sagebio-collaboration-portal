import passport from 'passport';
import {
    Strategy as SamlStrategy
} from 'passport-saml';
import {
    some
} from 'lodash/fp';

export function setup(User, config) {
    let demoAppConfig = {
        protocol: 'https://',
        // IdentityProvider (IdP) SAML SSO URL
        entryPoint: 'https://accounts.google.com/o/saml2/idp?idpid=C00s6x13p',
        // Service Provider (SP)
        issuer: 'demo1', // Entity ID (https://.../sp)
        path: '/auth/saml-demo/callback', // Assertion Consumer Service (ACS) URL
    };

    passport.use(new SamlStrategy({
        protocol: demoAppConfig.protocol,
        entryPoint: demoAppConfig.entryPoint,
        issuer: demoAppConfig.issuer,
        path: demoAppConfig.path,
    }, (profile, done) => {
        // Parse user profile data
        User
            .findOne({
                'saml-demo.nameID': profile.nameID
            }).exec()
            .then(user => {
                const userDataFromProvider = {
                    name: `${profile.firstName} ${profile.lastName}`,
                    email: profile.nameID,
                    provider: 'saml-demo',
                    'saml-demo': profile,
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

                // TODO: Remove '@therobbrennan.com$` entry once Sage has created a demo SAML Google App
                const authorizedEmails = [...config.userAccount.authorizedEmails, '@therobbrennan.com$'];
                var authorized = some((regexp) => user.email.toLowerCase().match(regexp), authorizedEmails);
                if (!authorized) {
                    return done(null, null, 'Unauthorized email address');
                }

                return user.save()
                    .then(savedUser => done(null, savedUser))
                    .catch(err => done(err));
            })
            .catch(err => done(err));
    })
    );
}
