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
import Reply from './reply.model';
import StarredMessage from '../starred-message/starred-message.model';
import User from '../user/user.model';

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
      console.log('entity saved', entity);
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
                .then(() => {
                    // remove stars individually to fire StarredMessage hook
                    return StarredMessage.find({
                            message: entity._id
                        })
                        .exec()
                        .then(stars => Promise.all(
                            stars.map(star => star.remove())
                        ));
                })
                .then(() => res.status(204).end());
        }
    };
}

// function removeMessageStars(res) {
//     return function (message) {
//         if (message) {
//             console.log('removing message', message);
//             return StarredMessage.deleteMany({ message: message._id })
//                 .then(() => message);  // return the message
//         }
//     }
// }

function handleEntityNotFound(res) {
    return function (entity) {
        console.log('entity', entity);
        if (!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function handleUserNotFound(res) {
    return function (user) {
        console.log('user object', user);
        if (!user) {
            res.status(404).end(); // TODO replace by auth error code
            return null;
        }
        console.log('user continue')
        return user;
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
    return Message.find(req.query)
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Message from the DB
export function show(req, res) {
    return Message.findById(req.params.id)
        .populate('createdBy', User.profileProperties)
        .populate('tags')
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
    return Message.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

// Stars a message by the current user
export function star(req, res) {
    var userId = req.user._id;
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
                        });
                    } else {
                        return star;
                    }
                });
        })
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Unstars a message by the current user
export function unstar(req, res) {
    var userId = req.user._id;
    return User.findById(userId)
        .exec()
        .then(user => {
            return StarredMessage.findOne({
                    message: req.params.id,
                    starredBy: userId
                })
                .exec();
        })
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

// Returns the number of users who have starred a message
export function starsCount(req, res) {
    StarredMessage.countDocuments({
        message: req.params.id
    }, function (err, count) {
        if (err) {
            res.status(404).json({
                error: err
            });
        }
        res.status(200).json({
            value: count
        });
    });
}

// Returns the messages starred by the user.
export function indexMyStars(req, res) {
    var userId = req.user._id;
    return User.findById(userId)
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).end(); // TODO: return auth error code
            }
            return StarredMessage
                .find({
                    starredBy: userId
                })
                .select('-starredBy')
                .exec();
        })
        .then(respondWithResult(res))
        .catch(handleError(res));
}

function findStarByUser(res, req) {
    return function (user) {
        if (user) {
            console.log('before searching star');
            console.log('message id', req.params.id);
            console.log('user id', user._id);
            return StarredMessage
                .findOne({
                    message: req.params.id,
                    starredBy: user._id
                })
                .select('-starredBy')
                .exec();
        }
        return null;
    };
}

function setStarArchiveValue(archived) {
    return function (star) {
        if (!star) {
            star.archived = archived;
            return star.save();
        }
        return null;
    };
}

// Archives the star of the user.
export function archiveStar(req, res) {
    var userId = req.user._id;
    return User.findById(userId)
        .exec()
        .then(handleUserNotFound(res))
        .then(findStarByUser(res, req))
        .then(handleEntityNotFound(res))
        .then(setStarArchived(true))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Unarchives the star of the user.
export function unarchiveStar(req, res) {
    var userId = req.user._id;
    return User.findById(userId)
        .exec()
        .then(handleUserNotFound(res))
        .then(findStarByUser(res, req))
        .then(handleEntityNotFound(res))
        .then(setStarArchived(false))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

function setStarArchived(archived) {
    return function (star) {
        if (star) {
            star.archived = archived;
            return star.save();
        }
        return null;
    };
}

// Unarchive the star of the user.

export function indexReplies(req, res) {
    return Reply.find({
            thread: req.params.id
        })
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

export function repliesCount(req, res) {
    Reply.countDocuments({
        thread: req.params.id
    }, function (err, count) {
        if (err) {
            res.status(404).json({
                error: err
            });
        }
        res.status(200).json({
            value: count
        });
    });
}
