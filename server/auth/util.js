import {
    omit
} from 'lodash/fp';

export function handleUnauthorizedOrganization(done) {
    return function (organization) {
        if (!organization) {
            done(null, null, 'Unauthorized organization');
            return null;
        }
        return organization;
    };
}

export function createOrUpdateUser(User, userDataFromProvider) {
    return function (organization) {
        if (organization) {
            return User
                .findOne({
                    email: userDataFromProvider.email
                })
                .exec()
                .then(user => {
                    if (user) {
                        userDataFromProvider = omit([
                            'username',
                            'email',
                            'role'
                        ], userDataFromProvider);
                        user = Object.assign(user, userDataFromProvider);
                    } else {
                        user = new User(userDataFromProvider);
                        user = Object.assign(user, {
                            role: 'user'
                        });
                    }
                    return user;
                });
        }
        return null;
    };
}

export function saveUser(done) {
    return function (user) {
        if (user) {
            return user.save()
                .then(savedUser => done(null, savedUser));
        }
        return null;
    }
}
