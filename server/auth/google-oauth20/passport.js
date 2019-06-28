import passport from 'passport';
import {
    Strategy as GoogleStrategy
} from 'passport-google-oauth20';
import {
    some
} from 'lodash/fp';

export function setup(User, config) {
    let googleConfig = {
        clientID: config.googleOAuth.clientID,
        clientSecret: config.googleOAuth.clientSecret,
        callbackURL: config.googleOAuth.callbackURL
    };
    passport.use(new GoogleStrategy(googleConfig,
        (accessToken, refreshToken, profile, done) => {
            User
                .findOne({
                    'google-oauth20.sub': profile.id
                }).exec()
                .then(user => {
                    const userDataFromProvider = {
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        picture: profile._json.picture,
                        provider: 'google-oauth20',
                        'google-oauth20': profile._json,
                        username: profile.emails[0].value.split('@')[0]
                    };

                    if (user) {
                        user = Object.assign(user, userDataFromProvider);
                    } else {
                        user = new User(userDataFromProvider);
                        user = Object.assign(user, {
                            role: 'user'
                        })
                    }

                    var authorized = some((regexp) => {
                        return user.email.toLowerCase().match(regexp);
                    }, config.userAccount.authorizedEmails);
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