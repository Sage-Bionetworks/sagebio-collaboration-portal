import Resource from './models/resource.model';
import EntityPermission from '../entity-permission/entity-permission.model';
import { entityTypes, accessTypes, inviteStatusTypes, entityVisibility } from '../../config/environment';
import {
    respondWithResult,
    patchUpdates,
    // removeEntity,
    handleEntityNotFound,
    handleError,
} from '../util';
import { union, pick } from 'lodash/fp';
import { getEntityIdsWithEntityPermissionByUser } from '../entity-permission/entity-permission.controller';
import { isAdmin } from '../../auth/auth';
import { getPublicProjectIds } from '../project/project.controller';
import { merge } from 'lodash';

// Returns the Resources visible to the user.
export function index(req, res) {
    const query = pick(['resourceType'], req.query);  // TODO add order filter



    getResourceIdsByUser(req.user._id)
        .then(resourceIds => {
            console.log('Resource visible to user', resourceIds);
            const filter = merge({
                _id: {
                    $in: resourceIds,
                }
            }, query);
            console.log('filter', filter);
            return filter;
        })
        .then(filter => Resource.find(filter)
            .exec()
        )
        .then(respondWithResult(res))
        .catch(handleError(res));
}



export function indexByEntity(req, res) {
    let filters = req.query;
    filters.projectId = req.params.entityId;
    return Resource.find(filters)
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}



// Gets a single Resource from the DB
export function show(req, res) {
    return Resource.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Resource in the DB
export function create(req, res) {
    return Resource.create({
        ...req.body,
        createdBy: req.user._id
    })
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Upserts the given Resource in the DB at the specified ID
export function upsert(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Resource
        .findOneAndUpdate({
            _id: req.params.id
        }, req.body, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
            runValidators: true
        }).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Updates an existing Resource in the DB
export function patch(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Resource.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// // Deletes a Resource from the DB
// export function destroy(req, res) {
//     return Resource.findById(req.params.id).exec()
//         .then(handleEntityNotFound(res))
//         .then(removeEntity(res))
//         .catch(handleError(res));
// }

// HELPER FUNCTIONS

/**
 * Returns the ids of the public resources.
 *
 * @return {string[]}
 */
export function getPublicResourceIds() {
    // For when visibility of Resources will be used
    // return Resource.find({ visibility: entityVisibility.PUBLIC.value }, '_id')
    //     .exec()
    //     .then(resources => resources.map(resource => resource._id));
    // Meanwhile when Resources inherit permission from Project
    return getPublicProjectIds()
        .then(projectIds => {
            console.log('public project found', projectIds);
            return projectIds;
        })
        .then(projectIds => Resource.find({
            projectId: {
                $in: projectIds
            }}, '_id')
            .exec()
        )
        .then(resources => {
            const a = resources.map(resource => resource._id);
            console.log('resource of public project found', a);
            return resources.map(resource => resource._id);
        });
}

/**
 * Returns the ids of all the resources.
 *
 * @return {string[]}
 */
export function getResourceIds() {
    return Resource.find({}, '_id')
        .exec()
        .then(resources => resources.map(resource => resource._id));
}

/**
 * Returns the ids of the resources visible to the user.
 *
 * @param {string} userId
 * @return {string[]}
 */
export function getResourceIdsByUser(userId) {
    return isAdmin(userId)
        .then(is =>
            (is
                ? getResourceIds()
                : Promise.all([
                    getPublicResourceIds(),
                    []
                    // getEntityIdsWithEntityPermissionByUser(
                    //     userId,
                    //     Object.values(accessTypes).map(access => access.value),
                    //     [inviteStatusTypes.ACCEPTED.value],
                    //     entityTypes.PROJECT.value
                    // ),
                ]).then(result => union(...result)))
        );
}
