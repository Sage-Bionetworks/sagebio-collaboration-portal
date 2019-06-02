/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/messages              ->  index
 * POST    /api/messages              ->  create
 * GET     /api/messages/:id          ->  show
 * PUT     /api/messages/:id          ->  upsert
 * PATCH   /api/messages/:id          ->  patch
 * DELETE  /api/messages/:id          ->  destroy
 */

import {
    applyPatch
} from 'fast-json-patch';
import Message from './message.model'
import StarredMessage from '../starred-message/starred-message.model';
import User from '../user/user.model';

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
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

function removeEntity(res) {
    return function (entity) {
        if (entity) {
            return entity.remove()
                .then(() => res.status(204).end());
        }
    };
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

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function (err) {
        res.status(statusCode).send(err);
    };
}

// Gets a list of Messages
export function index(req, res) {
    var userId = req.user._id;
    console.log('get all messages, user:', userId);

    return User.findById(userId)
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).end(); // change to invalid parameter code
            }
            console.log('user', user);
            // res.json(user.profile);
            return Message.find(req.query)
                .lean()
                .exec()
                .then(messages => {

                    let promises = messages.map(message => {
                        return StarredMessage.findOne({
                                message: message._id,
                                starredBy: user._id
                            })
                            .exec()
                            .then(starredMessage => {
                                let a = {
                                    ...message,
                                    starred: !!starredMessage
                                };
                                console.log('A', a);
                                return a;
                            });
                        // .then(starredMessage => ({
                        //     ...message,
                        //     starred: !!starredMessage
                        // }));
                    });
                    return Promise.all(promises);
                });
        })
        // .catch(err => next(err));
        .then(respondWithResult(res))
        .catch(handleError(res));

    return Message.find(req.query)
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Message from the DB
export function show(req, res) {
    return Message.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Message in the DB
export function create(req, res) {
    var userId = req.user._id;
    return User.findById(userId)
        .exec()
        .then(user => {
            let message = req.body;
            message.createdBy = user._id;
            return Message.create(message);
        })
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Upserts the given Message in the DB at the specified ID
// export function upsert(req, res) {
//     if (req.body._id) {
//         Reflect.deleteProperty(req.body, '_id');
//     }
//     return Message.findOneAndUpdate({
//             _id: req.params.id
//         }, req.body, {
//             new: true,
//             upsert: true,
//             setDefaultsOnInsert: true,
//             runValidators: true
//         }).exec()
//         .then(respondWithResult(res))
//         .catch(handleError(res));
// }

// Updates an existing Message in the DB
export function patch(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Message.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Message from the DB
export function destroy(req, res) {
    return Message.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

// Stars a message by the current user
export function star(req, res) {
    var userId = req.user._id;
    console.log('Starting to star, user', userId);
    return User.findById(userId)
        .exec()
        .then(user => {
            StarredMessage.findOne({
                message: req.params.id,
                starredBy: userId
            })
            .lean()
            .exec()
            .then(star => {
                if (!star) {
                    return StarredMessage.create({
                        message: req.params.id,
                        starredBy: userId
                    })
                    .then(star => star.message)
                } else {
                  return star.message;
                }
            })
            .then(messageId => {
                return Message.findOne(messageId)
                  .lean()
                  .exec()
                  .then(message => ({
                    ...message,
                    starred: true
                  }));
            })
            // let message = req.body;
            // message.createdBy = user._id;
            // return Message.create(message);
        })
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}
