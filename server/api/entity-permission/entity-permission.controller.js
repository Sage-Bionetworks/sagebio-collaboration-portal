import { pickBy, identity } from 'lodash/fp';
import EntityPermission from './entity-permission.model';
import {
    respondWithResult,
    patchUpdates,
    protectFromPatchRemove,
    protectFromPatchReplace,
    removeEntity,
    handleEntityNotFound,
    handleError,
} from '../util';
import { accessTypes, inviteStatusTypes } from '../../config/environment';

// Returns the permissions of the user
export function index(req, res) {
    return EntityPermission.find({
        ...req.query,
        user: req.user._id,
    })
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Returns the permission by Id
export function show(req, res) {
    return EntityPermission.findById(req.params.id)
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Returns the permissions associated to an entity
// TODO To review
export function indexByEntity(req, res) {
    return EntityPermission.find({
        entityId: req.params.entityId,
    })
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new EntityPermission
export function create(req, res) {
    Reflect.deleteProperty(req.body, '_id');
    Reflect.deleteProperty(req.body, 'createdAt');
    req.body.createdBy = req.user._id;

    return EntityPermission.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Updates an existing EntityPermission in the DB
export function patch(req, res) {
    // TODO sanitize: only replace op and check allowed values

    const patches = req.body;
    return (
        EntityPermission.findById(req.params.id)
            .exec()
            .then(handleEntityNotFound(res))
            // .then(handleEntityIdMismatch(res, req.params.entityId))
            .then(protectFromPatchRemove(res, patches, []))
            .then(protectFromPatchReplace(res, patches, ['access', 'status']))
            .then(handleOneAdminRemainingBeforePatch(res, req.body))
            .then(patchUpdates(patches))
            .then(respondWithResult(res))
            .catch(handleError(res))
    );
}

// Deletes a EntityPermission from the DB
export function destroy(req, res) {
    return (
        EntityPermission.findById(req.params.id)
            .exec()
            .then(handleEntityNotFound(res))
            // .then(handleEntityIdMismatch(res, req.params.entityId))
            .then(handleOneAdminRemainingBeforeRemoval(res))
            .then(removeEntity(res))
            .catch(handleError(res))
    );
}

// HELPER FUNCTIONS

function handleOneAdminRemainingBeforePatch(res, patches) {
    return function (permission) {
        if (permission && permission.access === accessTypes.ADMIN.value && patches) {
            // find if a patch could remove or downgrade the admin access
            let adminDowngradePatch = patches.find(
                patch_ =>
                    patch_.path === '/access'
                    && (patch_.op === 'remove' || patch_.op === 'replace')
                    && patch_.value !== accessTypes.ADMIN.value
            );

            if (adminDowngradePatch) {
                // figure out if its the last admin
                return EntityPermission.countDocuments({
                    entityId: permission.entityId,
                    access: accessTypes.ADMIN.value,
                })
                    .exec()
                    .then(count => {
                        if (count <= 1) {
                            res.status(403).send('Can not remove the last admin of an entity.');
                            return null;
                        }
                        return permission;
                    });
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
                access: accessTypes.ADMIN.value,
            }).exec((_, count) => {
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

// function handleEntityIdMismatch(res, entityIdFromParams) {
//     return function (entity) {
//         if (entity && entity.entityId.toString() !== entityIdFromParams.toString()) {
//             res.status(403).send('Entity Id mismatch');
//             return null;
//         }
//         return entity;
//     };
// }

/**
 * Returns the ids of the entities that have an entity-permission associated
 * to the user specified.
 *
 * @param {string} userId
 * @param {string[]} allowedAccessTypes (default: null)
 * @param {string[]} allowedInviteStatus (default: inviteStatusTypes.ACCEPTED.value)
 * @param {string} entityType (default: null)
 * @return {string[]}
 */
export function getEntityIdsWithEntityPermissionByUser(
    userId,
    allowedAccessTypes = null,
    allowedInviteStatus = [inviteStatusTypes.ACCEPTED.value],
    entityType = null
) {
    const filter = pickBy(identity, {
        user: userId,
        access: {
            $in: allowedAccessTypes,
        },
        status: {
            $in: allowedInviteStatus,
        },
        entityType,
    });
    return EntityPermission.find(filter, 'entityId')
        .exec()
        .then(permissions => permissions.map(p => p.entityId));
}
