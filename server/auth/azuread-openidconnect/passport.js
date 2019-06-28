import passport from 'passport';
import {
    OIDCStrategy
} from 'passport-azure-ad';

export function setup(User, config) {
  const azureADConfig = {
      identityMetadata: config.azureADOpenIDConnect.identityMetadata,
      clientID: config.azureADOpenIDConnect.clientID,
      clientSecret: config.azureADOpenIDConnect.clientSecret,  // TODO: Not used?
      // IMPORTANT: Any changes to redirect/callback URL routes will need to
      // be coordinated with Roche Azure AD configuration
      redirectUrl: config.azureADOpenIDConnect.redirectURL,
  };

    passport.use(new OIDCStrategy({
        // DEMO Azure AD
        //  Created as a demo app on therobbrennan.com ->
        //  https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/Overview/appId/a93c6ff1-9d42-498b-93d0-ef8eccb2e6e7/isMSAApp/
        identityMetadata: azureADConfig.identityMetadata,
        clientID: azureADConfig.clientID,
        clientSecret: azureADConfig.clientSecret,
        // PHCCP
        scope: ['email', 'profile'],
        responseType: 'id_token',
        responseMode: 'form_post',
        // allowHttpForRedirectUrl: true,  // Set to true if redirectUrl is http and not an https address
        redirectUrl: azureADConfig.redirectUrl,
    }, (iss, sub, profile, done) => {
        // console.log(`[DEMO Azure AD] Received SAML profile: ${JSON.stringify(profile, null, 2)}`);

        // Parse user profile data
        User
            .findOne({
                'azuread-openidconnect.email': profile._json.email
            }).exec()
            .then(user => {
                const userDataFromProvider = {
                    name: profile._json.name,
                    email: profile._json.email,
                    provider: 'azuread-openidconnect',
                    'azuread-openidconnect': profile._json,
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
