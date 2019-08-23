import { applyPatch } from 'fast-json-patch';
import {
    respondWithResult,
    handleUserNotFound,
    handleEntityNotFound,
    handleError,
    patchUpdates
} from '../util';
import Thread from './thread.model';
import User from '../user/user.model';
import Message from '../message/message.model';

// Creates a new Thread in the DB
export function create(req, res) {
    var userId = req.user._id;
    Reflect.deleteProperty(req.body, 'createdAt');
    req.body.createdBy = req.user._id.toString();
    req.body.entityId = req.params.entityId; // do not trust user

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
    return function(entity) {
        // TODO: Delete messages associated to this thread
        if (entity) {
            return entity
                .remove()
                .then(removeMessagesByThread())
                .then(() => res.status(204).end());
        }
    };
}

function removeMessagesByThread() {
    return function(thread) {
        if (thread) {
            return Message.deleteMany({ thread: thread._id }).exec();
        }
        return null;
    };
}