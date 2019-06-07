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

// Gets a list of Messages
export function index(req, res) {
    return Message.find({
            thread: {
                $exists: false
            }
        })
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Message from the DB
export function show(req, res) {
    return Message.findById(req.params.id)
        .populate('createdBy', User.profileProperties)  // hook not available
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
        .then(handleUserNotFound(res))
        .then(user => {
            return Message.create({
                ...req.body,
                createdBy: user._id
            });
        })
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

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
        .then(removeMessage(res))
        .catch(handleError(res));
}

// Stars a message by the current user
export function star(req, res) {
    var userId = req.user._id;
    return User.findById(userId)
        .exec()
        .then(handleUserNotFound(res))
        .then(createStar(res, req))
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Unstars a message by the current user
export function unstar(req, res) {
    var userId = req.user._id;
    return User.findById(userId)
        .exec()
        .then(handleUserNotFound(res))
        .then(findStar(req))
        .then(handleEntityNotFound(res))
        .then(removeStar(res))
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
                .exec();
        })
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Archives the star of the user.
export function archiveStar(req, res) {
    var userId = req.user._id;
    return User.findById(userId)
        .exec()
        .then(handleUserNotFound(res))
        .then(findStar(res, req))
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
        .then(findStar(res, req))
        .then(handleEntityNotFound(res))
        .then(setStarArchived(false))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Returns the replies of a message.
export function indexReplies(req, res) {
    return Message.find({
            thread: req.params.id
        })
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Returns the number of replies of a message.
export function repliesCount(req, res) {
    Message.countDocuments({
        thread: req.params.id
    }, function (err, count) {
        if (err) {
            res.status(404).json({
                error: err
            });
        } else {
            res.status(200).json({
                value: count
            });
        }
        return null;
    });
}

/**
 * Helper functions
 */

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

function removeMessage(res) {
    return function (entity) {
        if (entity) {
            return entity.remove()
                .then(removeStars(entity))
                .then(() => res.status(204).end());
        }
    };
}

function removeStars() {
    return function (message) {
        if (message) {
            // remove the star one by one to fire websocket hook
            return StarredMessage.find({
                    message: message._id
                })
                .exec()
                .then(stars => Promise.all(
                    stars.map(star => star.remove())
                ));
        }
        return null;
    }
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

function handleUserNotFound(res) {
    return function (user) {
        if (!user) {
            res.status(401).end();
            return null;
        }
        return user;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function (err) {
        res.status(statusCode).send(err);
    };
}

function createStar(res, req) {
    return function (user) {
        if (user) {
            return StarredMessage.create({
                message: req.params.id,
                starredBy: user._id
            });
        }
        return null;
    }
}

function removeStar(res, req) {
    return function (star) {
        if (star) {
            return star.remove()
        }
        return null;
    }
}

function findStar(req) {
    return function (user) {
        if (user) {
            return StarredMessage
                .findOne({
                    message: req.params.id,
                    starredBy: user._id
                })
                .exec();
        }
        return null;
    };
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
