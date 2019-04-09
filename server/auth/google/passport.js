import passport from 'passport';
import {
    Strategy as GoogleStrategy
} from 'passport-google-oauth20';

export function setup(User, config) {
    let googleConfig = {
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
    };
    passport.use(new GoogleStrategy(googleConfig,
        (accessToken, refreshToken, profile, done) => {
            User
                .findOne({
                    'google.sub': profile.id
                }).exec()
                .then(user => {
                    if (user) {
                        return done(null, user);
                    }

                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        picture: profile._json.picture,
                        role: 'user',
                        // username: profile.emails[0].value.split('@')[0],
                        provider: 'google',
                        google: profile._json
                    });
                    return user.save()
                        .then(savedUser => done(null, savedUser))
                        .catch(err => done(err));
                })
                .catch(err => done(err));
        }));
}
