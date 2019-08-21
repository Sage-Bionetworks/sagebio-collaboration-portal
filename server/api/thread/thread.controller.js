import { applyPatch } from 'fast-json-patch';
import {
    respondWithResult,
    handleUserNotFound,
    handleError
} from '../util';
import Thread from './thread.model';
import User from '../user/user.model';

// Creates a new Thread in the DB
export function createThread(req, res) {
    var userId = req.user._id;
    Reflect.deleteProperty(req.body, 'createdAt');
    req.body.createdBy = req.user._id.toString();
    req.body.entityId = req.params.entityId; // do not trust user

    return User.findById(userId)
        .exec()
        .then(handleUserNotFound(res))
        .then(user => {
            return Thread.create({
                ...req.body,
                createdBy: user._id,
            });
        })
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}
