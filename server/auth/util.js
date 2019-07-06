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
                        user = Object.assign(user, userDataFromProvider);
                    } else {
                        user = new User(userDataFromProvider);
                        user = Object.assign(user, {
                            role: 'user'
                        });
                    }
                    user.organization = organization._id;
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
