import { omit } from 'lodash/fp';
import {
    respondWithResult,
    handleUserNotFound,
    handleEntityNotFound,
    handleError,
    patchUpdates,
    removeEntity
} from '../util';
import Thread from './thread.model';
import User from '../user/user.model';
import Message from '../message/message.model';

// Creates a new Thread in the DB
export function create(req, res) {
    var userId = req.user._id;
    Reflect.deleteProperty(req.body, 'createdAt');
    req.body.createdBy = req.user._id.toString();
    req.body.entityId = req.params.entityId;

    return User.findById(userId)
        .exec()
        .then(handleUserNotFound(res))
        .then(user =>
            Thread.create({
                ...req.body,
                createdBy: user._id,
            })
        )
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Get a list of Threads for an entity
export function indexByEntity(req, res) {
    return Thread.find({
        entityId: req.params.entityId,
    })
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Updates an existing Thread in the DB
export function patch(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }

    return Thread.findById(req.params.threadId)
        .exec()
        .then(handleEntityNotFound(res))
        .then(validateEntityId(res, req.params.entityId))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Thread from the DB
export function destroy(req, res) {
    return Thread.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(removeThread(res))
        .catch(handleError(res));
}

// Returns the number of messages for the thread specified.
export function messagesCount(req, res) {
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

// Returns the messages for the thread specified.
export function indexMessages(req, res) {
    return Message.find({
        thread: {
            _id: req.params.id,
        },
    })
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Adds a message to the thread specified.
// TODO: Check that the message belong to the thread and entity specified as URL parameters
export function createMessage(req, res) {
    return Thread.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(addMessage(req.user, req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Patches the message specified.
// TODO: Check that the message belong to the thread and entity specified as URL parameters
export function patchMessage(req, res) {
    return Message.findById(req.params.messageId)
        .exec()
        .then(handleEntityNotFound(res))
        .then(updateMessage(req.user, req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes the message specified.
// TODO: Check that the message belong to the thread and entity specified as URL parameters
export function destroyMessage(req, res) {
    return Message.findById(req.params.messageId)
        .exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

// HELPER FUNCTIONS

function validateEntityId(res, targetEntityId) {
    return function (thread) {
        if (thread) {
            if (thread.entityId !== targetEntityId) {
                res.status(400).end();
            }
        }
        return null;
    }
}

function removeThread(res) {
    return function (entity) {
        if (entity) {
            return entity
                .remove()
                .then(removeMessagesByThread())
                .then(() => res.status(204).end());
        }
    };
}

function removeMessagesByThread() {
    return function (thread) {
        if (thread) {
            return Message.deleteMany({ thread: thread._id }).exec();
        }
        return null;
    };
}

function addMessage(user, message) {
    return function (thread) {
        if (thread) {
            message = omit(['_id', 'createdAt', 'updatedBy', 'updatedAt'], message);
            message.thread = thread._id.toString();
            message.createdBy = user._id.toString();
            message.updatedBy = user._id.toString();
            return Message.create(message);
        }
        return null;
    };
}

function updateMessage(user, patches) {
    return function (message) {
        if (message) {
            patches = patches.filter(
                p => ![
                    '_id',
                    'thread',
                    'createdAt',
                    'createdBy',
                    'updatedAt',
                    'updatedBy'
                ].map(x => `/${x}`).includes(p.path)
            );
            patches.push(...[
                { op: 'add', path: '/updatedBy', value: user._id.toString() },
                { op: 'replace', path: '/updatedAt', value: new Date() }
            ]);
            return patchUpdates(patches)(message);
        }
        return null;
    };
}
