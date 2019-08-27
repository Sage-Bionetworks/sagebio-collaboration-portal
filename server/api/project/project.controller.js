import { applyPatch } from 'fast-json-patch';
import Project from './project.model';
import EntityPermission from '../entity-permission/entity-permission.model';
import { entityTypes, accessTypes, inviteStatusTypes, userRoles, entityVisibility } from '../../config/environment';
import {
    respondWithResult,
    patchUpdates,
    protectFromPatchRemove,
    protectFromPatchReplace,
    removeEntity,
    handleEntityNotFound,
    handleError,
} from '../util';
import { union } from 'lodash/fp';
import { getEntityIdsWithEntityPermissionByUser } from '../entity-permission/entity-permission.controller';
import { isAdmin } from '../../auth/auth';

const ADMIN_ROLE = userRoles.ADMIN.value;

// Gets a list of Projects
// TODO: Make the function more readable
export function indexByUser(req, res) {
    getProjectIdsByUser(req.user._id)
        .then(projectIds => Project.find({
            _id: {
                $in: projectIds,
            }})
            .exec()
        )
        .then(respondWithResult(res))
        .catch(handleError(res));



    // if (user.role === ADMIN_ROLE) {
    //     return Project.find()
    //         .exec()
    //         .then(respondWithResult(res))
    //         .catch(handleError(res));
    // } else {
    //     return EntityPermission.find({
    //         user: user._id,
    //         entityType: entityTypes.PROJECT.value,
    //         status: inviteStatusTypes.ACCEPTED.value,
    //     })
    //         .exec()
    //         .then(permissions => {
    //             const projectIds = permissions.map(perm => perm.entityId);
    //             return Project.find({
    //                 _id: {
    //                     $in: projectIds,
    //                 },
    //             })
    //                 .exec()
    //                 .then(respondWithResult(res))
    //                 .catch(handleError(res));
    //         })
    //         .catch(handleError(res));
    // }
}

// Gets a single Project from the DB
export function show(req, res) {
    return Project.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Project in the DB
export function create(req, res) {
    Reflect.deleteProperty(req.body, 'createdAt');
    req.body.createdBy = req.user._id.toString();

    return Project.create(req.body)
        .then(createAdminPermissionForEntity(req.user, entityTypes.PROJECT.value))
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Updates an existing Project in the DB
export function patch(req, res) {
    const patches = req.body.filter(patch => !['_id', 'createdAt', 'createdBy'].map(x => `/${x}`).includes(patch.path));

    return Project.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(patches))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Project from the DB
export function destroy(req, res) {
    return Project.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

// HELPER FUNCTIONS

function createAdminPermissionForEntity(user, entityType) {
    return function (entity) {
        if (entity) {
            return EntityPermission.create({
                entityId: entity._id.toString(),
                entityType,
                user: user._id.toString(),
                access: accessTypes.ADMIN.value,
                status: inviteStatusTypes.ACCEPTED.value,
                createdBy: user._id.toString(),
            })
                .then(() => entity)
                .catch(err => console.log(err));
        }
        return null;
    };
}

/**
 * Returns the ids of the public projects.
 *
 * @return {string[]}
 */
export function getPublicProjectIds() {
    return Project.find({ visibility: entityVisibility.PUBLIC.value }, '_id')
        .exec()
        .then(projects => projects.map(project => project._id.toString()));
}

/**
 * Returns the ids of all the projects.
 *
 * @return {string[]}
 */
export function getProjectIds() {
    console.log('IS ADMIN');
    return Project.find({}, '_id')
        .exec()
        .then(projects => projects.map(project => project._id.toString()));
}

/**
 * Returns the ids of the projects visible to the user.
 *
 * @param {string} userId
 * @return {string[]}
 */
export function getProjectIdsByUser(userId) {
    return isAdmin(userId)
        .then(is =>
            (is
                ? getProjectIds()
                : Promise.all([
                    getPublicProjectIds(),
                    getEntityIdsWithEntityPermissionByUser(
                        userId,
                        Object.values(accessTypes).map(access => access.value),
                        [inviteStatusTypes.ACCEPTED.value],
                        entityTypes.PROJECT.value
                    ),
                ]).then(result => union(...result)))
        );
}

// export function getProjectIds(user) {
//     return isAdmin(user._id.toString())
//         then(isAdmin => isAdmin ? getProjectIds() : getProjectIdsByUser(user._id.toString()));
// }
