import passport from 'passport';
import {
    OIDCStrategy
} from 'passport-azure-ad';

export function setup(User) {
    passport.use(new OIDCStrategy({
        // DEMO Azure AD
        //  Created as a demo app on therobbrennan.com ->
        //  https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/Overview/appId/a93c6ff1-9d42-498b-93d0-ef8eccb2e6e7/isMSAApp/
        identityMetadata: 'https://login.microsoftonline.com/0aeec3ea-a03d-4f3c-8161-58fc588c3611/v2.0/.well-known/openid-configuration',
        clientID: 'a93c6ff1-9d42-498b-93d0-ef8eccb2e6e7',

        // PHCCP
        scope: ['email', 'profile'],
        responseType: 'id_token',
        responseMode: 'form_post',
        // allowHttpForRedirectUrl: true,  // Set to true if redirectUrl is http and not an https address
        redirectUrl: 'https://sage-dev-rb.ngrok.io/auth/saml-demo-azure-ad/callback',
    }, (iss, sub, profile, done) => {
        // console.log(`[DEMO Azure AD] Received SAML profile: ${JSON.stringify(profile, null, 2)}`);

        // Parse user profile data
        User
            .findOne({
                'saml-demo-azure-ad.email': profile._json.email
            }).exec()
            .then(user => {
                const userDataFromProvider = {
                    name: profile._json.name,
                    email: profile._json.email,
                    provider: 'saml-demo-azure-ad',
                    'saml-demo-azure-ad': profile._json,
                    username: profile._json.email,
                };

                if (user) {
                    user = Object.assign(user, userDataFromProvider);
                } else {
                    user = new User(userDataFromProvider);
                    user = Object.assign(user, {
                        role: 'user'
                    });
                }

                return user.save()
                    .then(savedUser => done(null, savedUser))
                    .catch(err => done(err));
            })
            .catch(err => done(err));
    }));
}
