import { omit } from 'lodash/fp';
import ActionPermission from '../api/action-permission/action-permission.model';
import { userRoles, init, actionPermissionTypes } from '../config/environment';

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
            return User.findOne({
                email: userDataFromProvider.email,
            })
                .exec()
                .then(user => {
                    if (user) {
                        userDataFromProvider = omit(['username', 'email', 'role'], userDataFromProvider);
                        user = Object.assign(user, userDataFromProvider);
                    } else {
                        user = new User(userDataFromProvider);
                        user = Object.assign(user, {
                            role: userRoles.USER.value,
                        });
                    }
                    return user;
                });
        }
        return null;
    };
}

export function giveInitAdminRole() {
    return function (user) {
        if (user && user.email === init.admin.email) {
            user.role = userRoles.ADMIN.value;
        }
        return user;
    };
}

export function saveUser(done) {
    return function (user) {
        if (user) {
            if (user._id) { // returning user
                return user.save().then(savedUser => done(null, savedUser));
            } else { // new user
                return user
                    .save()
                    .then(newUser => {
                        // TODO Implement in a more promise-chain friendly way
                        ActionPermission.create([
                            {
                                user: newUser._id,
                                action: actionPermissionTypes.CREATE_PROJECT.value,
                                createdBy: newUser._id, // TODO: Is this the best choice?
                            },
                        ]).then(() => newUser);
                    })
                    .then(savedUser => done(null, savedUser));
            }
        }
        return null;
    };
}
