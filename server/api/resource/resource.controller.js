import { union } from 'lodash/fp';
import { merge } from 'lodash';
import { isAdmin } from '../../auth/auth';
import { respondWithResult, patchUpdates, removeEntity, handleEntityNotFound, handleError } from '../util';
import { getPublicProjectIds, getPrivateProjectIds } from '../project/project.controller';
import { buildEntityIndexQuery } from '../entity-util';
import Resource from './models/resource.model';

// Returns the Resources visible to the user.
export function index(req, res) {
    let { filter, projection, sort, skip, limit } = buildEntityIndexQuery(req.query);

    getResourceIdsByUser(req.user._id)
        .then(resourceIds => {
            filter = merge(
                {
                    _id: {
                        $in: resourceIds,
                    },
                },
                filter
            );
            return filter;
        })
        .then(filter_ =>
            Promise.all([
                Resource.countDocuments(filter_),
                Resource.find(filter_, projection)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .exec(),
            ])
        )
        .then(([count, resources]) => ({
            count,
            results: resources,
        }))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Resource from the DB
export function show(req, res) {
    return Resource.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Resource in the DB
export function create(req, res) {
    return Resource.create({
        ...req.body,
        createdBy: req.user._id,
    })
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Updates an existing Resource in the DB
export function patch(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Resource.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Resource from the DB
export function destroy(req, res) {
    return Resource.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

// HELPER FUNCTIONS

/**
 * Returns the ids of the public resources.
 * @return {string[]}
 */
function getPublicResourceIds() {
    // For when visibility of Resources will be used
    // return Resource.find({ visibility: entityVisibility.PUBLIC.value }, '_id')
    //     .exec()
    //     .then(resources => resources.map(resource => resource._id));
    // Meanwhile when Resources inherit permission from Project
    return getPublicProjectIds()
        .then(projectIds =>
            Resource.find(
                {
                    projectId: {
                        $in: projectIds,
                    },
                },
                '_id'
            ).exec()
        )
        .then(resources => resources.map(resource => resource._id));
}

/**
 * Returns the ids of the private resources visible to a user.
 * @param {string} userId
 */
function getPrivateResourceIds(userId) {
    return getPrivateProjectIds(userId)
        .then(projectIds =>
            Resource.find(
                {
                    projectId: {
                        $in: projectIds,
                    },
                },
                '_id'
            ).exec()
        )
        .then(resources => resources.map(resource => resource._id));
}

/**
 * Returns the ids of all the resources.
 * @return {string[]}
 */
function getAllResourceIds() {
    return Resource.find({}, '_id')
        .exec()
        .then(resources => resources.map(resource => resource._id));
}

/**
 * Returns the ids of the resources visible to the user.
 * @param {string} userId
 * @return {string[]}
 */
function getResourceIdsByUser(userId) {
    return isAdmin(userId).then(is =>
        (is
            ? getAllResourceIds()
            : Promise.all([getPublicResourceIds(), getPrivateResourceIds(userId)]).then(result => union(...result)))
    );
}
