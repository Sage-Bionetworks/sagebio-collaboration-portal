import passport from 'passport';
import {
    OIDCStrategy
} from 'passport-azure-ad';

export function setup(User, config) {
    const rocheAzureADConfig = {
        identityMetadata: config.rocheAzureAD.identityMetadata,
        clientID: config.rocheAzureAD.clientID,
        clientSecret: config.rocheAzureAD.clientSecret,
        // IMPORTANT: Any changes to redirect/callback URL routes will need to
        // be coordinated with Roche Azure AD configuration
        redirectUrl: config.rocheAzureAD.redirectURL,
    };

    console.log('REDIRECT', rocheAzureADConfig.redirectUrl);

    var strategy = new OIDCStrategy({
        identityMetadata: rocheAzureADConfig.identityMetadata,
        clientID: rocheAzureADConfig.clientID,
        clientSecret: rocheAzureADConfig.clientSecret,
        redirectUrl: rocheAzureADConfig.redirectUrl,
        scope: ['email', 'profile'],
        responseType: 'id_token',
        responseMode: 'form_post',
    }, (iss, sub, profile, done) => {
        console.log(`[PHCCP Azure AD] Received SAML profile: ${JSON.stringify(profile, null, 2)}`);
        /*
        Sample response from Roche Azure AD:
        {
            "sub": "Oz7q4DHGUARHjqjJGgmG3Eg4sqZmw3ySotK1QfRsbyw",
            "oid": "03dd772a-ffc0-495d-b587-2092569dcebe",
            "displayName": "Welch, Kathleen {FIRD~South San Francisco}",
            "name": {
                "familyName": "Welch",
                "givenName": "Kathleen"
            },
            "_raw": "{\"aud\":\"22880060-56fa-4993-bcc1-d1debcef4eb4\",\"iss\":\"https://sts.windows.net/c8036283-1408-4dc8-b870-31e789a0a528/\",\"iat\":1561570364,\"nbf\":1561570364,\"exp\":1561574264,\"aio\":\"AUQAu/8LAAAArOqsMjWlmLYzTDBZuf5W1ZcDzQfF8JprWVjNeT8fCthEGCtTRHHBFdZXYFvOj8r6p1j1slS607j7k5+6cgKe/g==\",\"email\":\"kwelch@nala.roche.com\",\"family_name\":\"Welch\",\"given_name\":\"Kathleen\",\"idp\":\"https://sts.windows.net/5407423b-52cb-4385-a688-3118410c932b/\",\"ipaddr\":\"107.77.214.47\",\"name\":\"Welch, Kathleen {FIRD~South San Francisco}\",\"nonce\":\"-O1FMyEvI8WkrLRxiL0kYNzVuct7m3dZ\",\"oid\":\"03dd772a-ffc0-495d-b587-2092569dcebe\",\"sub\":\"Oz7q4DHGUARHjqjJGgmG3Eg4sqZmw3ySotK1QfRsbyw\",\"tid\":\"c8036283-1408-4dc8-b870-31e789a0a528\",\"unique_name\":\"kwelch@nala.roche.com\",\"uti\":\"KHG0jghcjESom0wTMvMlAA\",\"ver\":\"1.0\",\"rsiUserID\":\"kwelch\",\"rsiUserType\":\"Internal\",\"rsiMail\":\"welch.kathleen@gene.com\"}",
            "_json": {
                "aud": "22880060-56fa-4993-bcc1-d1debcef4eb4",
                "iss": "https://sts.windows.net/c8036283-1408-4dc8-b870-31e789a0a528/",
                "iat": 1561570364,
                "nbf": 1561570364,
                "exp": 1561574264,
                "aio": "AUQAu/8LAAAArOqsMjWlmLYzTDBZuf5W1ZcDzQfF8JprWVjNeT8fCthEGCtTRHHBFdZXYFvOj8r6p1j1slS607j7k5+6cgKe/g==",
                "email": "kwelch@nala.roche.com",
                "family_name": "Welch",
                "given_name": "Kathleen",
                "idp": "https://sts.windows.net/5407423b-52cb-4385-a688-3118410c932b/",
                "ipaddr": "107.77.214.47",
                "name": "Welch, Kathleen {FIRD~South San Francisco}",
                "nonce": "-O1FMyEvI8WkrLRxiL0kYNzVuct7m3dZ",
                "oid": "03dd772a-ffc0-495d-b587-2092569dcebe",
                "sub": "Oz7q4DHGUARHjqjJGgmG3Eg4sqZmw3ySotK1QfRsbyw",
                "tid": "c8036283-1408-4dc8-b870-31e789a0a528",
                "unique_name": "kwelch@nala.roche.com",
                "uti": "KHG0jghcjESom0wTMvMlAA",
                "ver": "1.0",
                "rsiUserID": "kwelch",
                "rsiUserType": "Internal",
                "rsiMail": "welch.kathleen@gene.com"
            }
        }
        */

        // Parse user profile data
        User
            .findOne({
                username: profile._json.rsiUserID
            }).exec()
            .then(user => {
                const userDataFromProvider = {
                    name: `${profile._json.given_name} ${profile._json.family_name}` || profile._json.name, // Default to name if given and family names are not provided
                    email: profile._json.rsiMail || profile._json.email, // Default to Roche email address if the expected rsiMail is not provided
                    provider: 'phccp',
                    phccp: profile._json,
                    username: profile._json.rsiUserID || profile.displayName, // Use Roche username; default to displayName if none is provided
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
    });

    passport.use('phccp', strategy);
}
