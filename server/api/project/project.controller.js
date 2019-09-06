import Project from './project.model';
import EntityPermission from '../entity-permission/entity-permission.model';
import { entityTypes, accessTypes, inviteStatusTypes, entityVisibility } from '../../config/environment';
import {
    respondWithResult,
    patchUpdates,
    removeEntity,
    handleEntityNotFound,
    handleError,
} from '../util';
import { union } from 'lodash/fp';
import { merge } from 'lodash';
import { getEntityIdsWithEntityPermissionByUser } from '../entity-permission/entity-permission.controller';
import { isAdmin } from '../../auth/auth';
import { buildEntityIndexQuery } from '../entity-util';

// Gets a list of Projects
export function index(req, res) {
    let { filter, projection, sort, skip, limit } = buildEntityIndexQuery(req.query);

    getProjectIdsByUser(req.user._id)
        .then(projectIds => {
            filter = merge({
                _id: {
                    $in: projectIds,
                }
            }, filter);
            return filter;
        })
        .then(filter_ => Promise.all([
            Project.countDocuments(filter_),
            Project.find(filter_, projection)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec()
        ]))
        .then(([count, resources]) => ({
            count,
            results: resources
        }))
        .then(respondWithResult(res))
        .catch(handleError(res));
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
    // TODO sanitize visibility

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

// Returns whether a project is public or private
export function showVisibility(req, res) {
    return Project.findById(req.params.id, 'visibility')
        .exec()
        .then(handleEntityNotFound(res))
        .then(project => project && project.visibility)
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Makes a project public.
export function makePublic(req, res) {
    const patches = [{
        op: 'replace',
        path: '/visibility',
        value: entityVisibility.PUBLIC.value
    }];

    return Project.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(patches))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Makes a project private.
export function makePrivate(req, res) {
    const patches = [{
        op: 'replace',
        path: '/visibility',
        value: entityVisibility.PRIVATE.value
    }];

    return Project.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(patches))
        .then(respondWithResult(res))
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
 * @return {string[]}
 */
export function getPublicProjectIds() {
    return Project.find({ visibility: entityVisibility.PUBLIC.value }, '_id')
        .exec()
        .then(projects => projects.map(project => project._id));
}

/**
 * Returns the ids of the private projects visible to a user.
 * @param {string} userId
 */
export function getPrivateProjectIds(userId) {
    return getEntityIdsWithEntityPermissionByUser(
        userId,
        Object.values(accessTypes).map(access => access.value),
        [inviteStatusTypes.ACCEPTED.value],
        entityTypes.PROJECT.value
    );
}

/**
 * Returns the ids of all the projects.
 * @return {string[]}
 */
export function getAllProjectIds() {
    return Project.find({}, '_id')
        .exec()
        .then(projects => projects.map(project => project._id));
}

/**
 * Returns the ids of the projects visible to the user.
 * @param {string} userId
 * @return {string[]}
 */
export function getProjectIdsByUser(userId) {
    return isAdmin(userId)
        .then(is =>
            (is
                ? getAllProjectIds()
                : Promise.all([
                    getPublicProjectIds(),
                    getPrivateProjectIds(userId)
                ]).then(result => union(...result))
            )
        );
}
