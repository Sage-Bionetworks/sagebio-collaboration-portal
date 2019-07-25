import User from './user.model';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import {
    pickBy,
    identity
} from 'lodash/fp';
import { applyPatch } from 'fast-json-patch';

function validationError(res, statusCode) {
    statusCode = statusCode || 422;
    return err => res.status(statusCode).json(err);
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return err => {
      console.log('ERR', err);
      return res.status(statusCode).send(err);
    };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
    let filter = pickBy(identity, {
        username: req.query.username ? {
            $regex: `^${req.query.username}`,
            $options: 'i'
        } : null,
    });

    return User.find(filter, '-salt -password')
        .exec()
        .then(users => {
            users = users.map(user => user.profile);
            res.status(200).json(users);
        })
        .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res) {
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.role = 'user';
    newUser.createdBy = req.user._id.toString();

    return newUser.save()
        .then(user => {
            var token = jwt.sign({
                _id: user._id
            }, config.secrets.session, {
                expiresIn: 60 * 60 * 5
            });
            res.json({
                token
            });
        })
        .catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
    var userId = req.params.id;

    return User.findById(userId)
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).end();
            }
            res.json(user.profile);
        })
        .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
    return User.findByIdAndRemove(req.params.id).exec()
        .then(() => {
            res.status(204).end();
        })
        .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    return User.findById(userId).exec()
        .then(user => {
            if (user.authenticate(oldPass)) {
                user.password = newPass;
                return user.save()
                    .then(() => {
                        res.status(204).end();
                    })
                    .catch(validationError(res));
            } else {
                return res.status(403).end();
            }
        });
}

/**
 * Change a users role
 */
export function changeRole(req, res) {
    var userId = req.params.id;
    var newRole = String(req.body.newRole);

    return User.findById(userId).exec()
        .then(user => {
            if (user) {
                user.role = newRole;
                return user.save()
                    .then((response) => {
                        res.status(204).end(response);
                    })
                    .catch(handleError(res));
            } else {
                return res.status(400).end();
            }
        });
}

/**
 * Get my info
 */
export function me(req, res, next) {
    var userId = req.user._id;

    return User
        .findOne({
            _id: userId
        }, '-salt -password').exec()
        .then(user => { // don't ever give out the password or salt
            if (!user) {
                return res.status(401).end();
            }
            return res.json(user);
        })
        .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
    res.redirect('/');
}

// Updates an existing User in the DB
export function patch(req, res) { // WIP #170 - Implementation to PATCH user data
    const patches = req.body.filter(patch => ![
        '_id',
        'createdAt',
        'createdBy'
    ].map(x => `/${x}`).includes(patch.path));

    // WIP #170 - Refactor this to use async/await
    return User.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(patches))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

function handleEntityNotFound(res) {
    return function (entity) {
        if (!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function patchUpdates(patches) {
    return function (entity) {
        try {
            applyPatch(entity, patches, /*validate*/ true);
        } catch (err) {
            return Promise.reject(err);
        }

        return entity.save();
    };
}

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}
