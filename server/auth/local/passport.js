import passport from 'passport';
import {
    Strategy as LocalStrategy
} from 'passport-local';
var util = require('../util');

function localAuthenticate(User, email, password, done) {
    return function (organization) {
        if (organization) {
            return User
                .findOne({
                    email: email.toLowerCase()
                }).exec()
                .then(user => {
                    if (!user) {
                        return done(null, false, {
                            message: 'This email is not registered.',
                            field: 'email'
                        });
                    }
                    return user.authenticate(password, (authError, authenticated) => {
                        if (authError) {
                            return done(authError);
                        }
                        if (!authenticated) {
                            return done(null, false, {
                                message: 'This password is not correct.',
                                field: 'password'
                            });
                        } else {
                            return done(null, user);
                        }
                    });
                })
                .catch(err => done(err));
        }
        return null;
    };
}

export function setup(User, Organization) { // /*, config*/
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {
        const domain = email.split('@')[1];

        Organization
            .findOne({
                domains: domain,
                active: true
            })
            .exec()
            .then(util.handleUnauthorizedOrganization(done))
            .then(localAuthenticate(User, email, password, done))
            .catch(err => done(err));
    }));
}
