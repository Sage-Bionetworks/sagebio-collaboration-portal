import {
    find
} from 'lodash/fp';
import EntityPermission from './entity-permission.model';
import User from '../user/user.model';
import {
    respondWithResult,
    patchUpdates,
    protectFromPatchRemove,
    protectFromPatchReplace,
    removeEntity,
    handleEntityNotFound,
    handleError
} from '../util';
import {
    accessTypes
} from '../../config/environment';

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
        ...req.query,
        user: userId
    })
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Returns the permissions associated to an entity
export function indexByEntity(req, res) {
    return EntityPermission.find({
        entityId: req.params.entityId
    })
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
    const patches = req.body;
    return EntityPermission.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(handleEntityIdMismatch(res, req.params.entityId))
        .then(protectFromPatchRemove(res, patches, []))
        .then(protectFromPatchReplace(res, patches, [
            'access',
            'status'
        ]))
        .then(handleOneAdminRemainingBeforePatch(res, req.body))
        .then(patchUpdates(patches))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a EntityPermission from the DB
export function destroy(req, res) {
    return EntityPermission.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(handleEntityIdMismatch(res, req.params.entityId))
        .then(handleOneAdminRemainingBeforeRemoval(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

// HELPER FUNCTIONS

function handleOneAdminRemainingBeforePatch(res, patches) {
    return function (permission) {
        if (permission && permission.access === accessTypes.ADMIN.value && patches) {
            // find if a patch could remove or downgrade the admin access
            let patch = find(patch => {
                return patch.path === '/access' && (
                    patch.op === 'remove' || (
                        patch.op === 'replace' &&
                        patch.value !== accessTypes.ADMIN.value
                    )
                )
            }, patches);

            if (patch) {
                // figure out if its the last admin
                return EntityPermission.countDocuments({
                    entityId: permission.entityId,
                    access: accessTypes.ADMIN.value
                })
                    .exec((err, count) => {
                        if (count <= 1) {
                            res.status(403).send('Can not remove the last admin of an entity.');
                            return null;
                        }
                        return permission;
                    })
            }
        }
        return permission;
    };
}

function handleOneAdminRemainingBeforeRemoval(res) {
    return function (permission) {
        if (permission && permission.access === accessTypes.ADMIN.value) {
            return EntityPermission.countDocuments({
                entityId: permission.entityId,
                access: accessTypes.ADMIN.value
            })
                .exec((err, count) => {
                    if (count <= 1) {
                        res.status(403).send('Can not remove the last admin of an entity.');
                        return null;
                    }
                    return permission;
                });
        }
        return permission;
    };
}

function handleEntityIdMismatch(res, entityIdFromParams) {
    return function (entity) {
        if (entity && entity.entityId.toString() !== entityIdFromParams.toString()) {
            res.status(403).send('Entity Id mismatch');
            return null;
        }
        return entity;
    };
}
