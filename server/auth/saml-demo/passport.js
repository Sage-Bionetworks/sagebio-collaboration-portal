import passport from 'passport';
import {
    Strategy as SamlStrategy
} from 'passport-saml';

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
        console.log(`Received SAML profile data: ${JSON.stringify(profile, null, 2)}`);
        /**
            Received SAML profile data: {
                "issuer": "https://accounts.google.com/o/saml2?idpid=C00s6x13p",
                "sessionIndex": "_ab014893879f677aae8d42341ab10ed8",
                "nameID": "rob@therobbrennan.com",
                "nameIDFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
                "firstName": "Rob",
                "lastName": "Brennan",
                "primaryEmail": "rob@therobbrennan.com"
            }
         */
        done(null, profile);
      })
    );

    // passport.use(new GoogleStrategy(googleConfig,
    //     (accessToken, refreshToken, profile, done) => {
    //         User
    //             .findOne({
    //                 'google.sub': profile.id
    //             }).exec()
    //             .then(user => {
    //                 const userDataFromProvider = {
    //                     name: profile.displayName,
    //                     email: profile.emails[0].value,
    //                     picture: profile._json.picture,
    //                     provider: 'google',
    //                     google: profile._json,
    //                     username: profile.emails[0].value.split('@')[0]
    //                 };

    //                 if (user) {
    //                     user = Object.assign(user, userDataFromProvider);
    //                 } else {
    //                     user = new User(userDataFromProvider);
    //                     user = Object.assign(user, {
    //                         role: 'user'
    //                     })
    //                 }

    //                 var authorized = some((regexp) => {
    //                     return user.email.toLowerCase().match(regexp);
    //                 }, config.userAccount.authorizedEmails);
    //                 if (!authorized) {
    //                     return done(null, null, 'Unauthorized email address');
    //                 }

    //                 return user.save()
    //                     .then(savedUser => done(null, savedUser))
    //                     .catch(err => done(err));
    //             })
    //             .catch(err => done(err));
    //     }));
}
