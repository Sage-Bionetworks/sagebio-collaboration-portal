import passport from 'passport';
import {
    OIDCStrategy
} from 'passport-azure-ad';

export function setup(User) {
    passport.use(new OIDCStrategy({
        identityMetadata: 'https://login.microsoftonline.com/0aeec3ea-a03d-4f3c-8161-58fc588c3611/v2.0/.well-known/openid-configuration',
        clientID: 'a93c6ff1-9d42-498b-93d0-ef8eccb2e6e7',
        responseType: 'id_token',
        responseMode: 'form_post',
        // allowHttpForRedirectUrl: true,  // Set to true if redirectUrl is http and not an https address
        redirectUrl: 'https://sage-dev-rb.ngrok.io/auth/saml-demo-azure-ad/callback',
    }, (profile, done) => {
        console.log(`Azure profile received: ${JSON.stringify(profile)}`);
        // Parse user profile data
        User
            .findOne({
                'saml-demo-azure-ad.sub': profile.sub
            }).exec()
            .then(user => {
                const userDataFromProvider = {
                    sub: profile.sub,
                    name: 'DEMO USER',
                    email: 'noone@mail.com',
                    provider: 'saml-demo-azure-ad',
                    'saml-demo-azure-ad': profile,
                    username: 'DEMO USER',
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
