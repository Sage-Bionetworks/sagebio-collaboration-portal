import {
    applyPatch
} from 'fast-json-patch';
import EntityPermission from './entity-permission.model';
import User from '../user/user.model';
import {
    respondWithResult,
    patchUpdates,
    removeEntity,
    handleEntityNotFound,
    handleError
} from '../util';

// Gets a list of EntityPermissions
export function index(req, res) {
    return EntityPermission.find()
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Returns the permissions of the user
export function indexMine(req, res) {
    var userId = req.user._id;
    return EntityPermission.find({
            user: userId
        })
        .populate('user', User.profileProperties)
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Returns the permissions associated to an entity
export function indexByEntity(req, res) {
    return EntityPermission.find({
            entityId: req.params.entityId
        })
        .populate('user', User.profileProperties)
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new EntityPermission
export function create(req, res) {
    Reflect.deleteProperty(req.body, '_id');
    Reflect.deleteProperty(req.body, 'createdAt');
    req.body.entityId = req.params.entityId;
    req.body.createdBy = req.user._id;

    return EntityPermission.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Updates an existing EntityPermission in the DB
export function patch(req, res) {
    const protectedProperties = [
        '_id',
        'entityId',
        'entityType',
        'user',
        'createdAt',
        'createdBy'
    ];
    for (var path of req.body.map(patch => patch.path)) {
        if (protectedProperties.includes(path)) {
            res.status(400).send(`The following document properties can ` +
                `not be updated: ${protectedProperties.join(' ')}`);
            return null;
        }
    }

    return EntityPermission.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a EntityPermission from the DB
export function destroy(req, res) {
    return EntityPermission.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}
