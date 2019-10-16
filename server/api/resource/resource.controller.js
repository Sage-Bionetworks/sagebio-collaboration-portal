import { union } from 'lodash/fp';
import { merge } from 'lodash';
import rp from 'request-promise';
import { isAdmin } from '../../auth/auth';
import { respondWithResult, patchUpdates, removeEntity, handleEntityNotFound, handleError } from '../util';
import { getPublicProjectIds, getPrivateProjectIds } from '../project/project.controller';
import { buildEntityIndexQuery } from '../entity-util';
import Resource from './models/resource.model';
import Tool from '../tool/tool.model';
import User from '../user/user.model';
import { entityTypes, resourceTypes, activityTypes, provenance } from '../../config/environment';

// Returns the Resources visible to the user.
export function index(req, res) {
    let { filter, projection, sort, skip, limit } = buildEntityIndexQuery(req.query, ['resourceType', 'projectId']);

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
    // TODO Sanitize submitted resource
    return Resource.create({
        ...req.body,
        createdBy: req.user._id,
    })
        .then(createNewResourceActivity(req.user, req.body.tool))
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Updates an existing Resource in the DB
export function patch(req, res) {
    Reflect.deleteProperty(req.body, '_id');

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

/**
 * Creates a provenance record for the creation of a new resource.
 * @param {User} user
 * @param {string} toolId
 */
function createNewResourceActivity(user, toolId) {
    return function (resource) {
        if (resource) {
            return new Promise(async resolve => {
                let activity = {
                    'agents': [{
                        'userId': user._id,
                        'name': user.name, // TODO should not be provided to provenance
                        'role': '' // TODO user.role?
                    }],
                    'description': resource.description, // TODO should not be provided to provenance (?)
                    'class': activityTypes.RESOURCE_REGISTRATION.value,
                    'generated': [{
                        'name': resource.title, // TODO should not be provided to provenance
                        'role': '', // TODO What is this role?
                        'targetId': resource._id,
                        'targetVersionId': '1',
                        'class': entityTypes.RESOURCE.value,
                        'subclass': resource.resourceType
                    }],
                    'name': `Creation of ${resource.title}`, // TODO should not be provided to provenance
                    'used': []
                };

                if (resource.resourceType === resourceTypes.STATE.value) {
                    if (!toolId) {
                        throw new Error('Invalid State: property tool is missing');
                    }
                    let tool = await Tool.findById(toolId, '_id title');
                    if (tool) {
                        activity.class = activityTypes.TOOL_SESSION.value;
                        activity.used.push({
                            'name': tool.title,
                            'role': '',
                            'targetId': tool._id,
                            'targetVersionId': '1',
                            'class': entityTypes.TOOL.value,
                            'subclass': entityTypes.TOOL.value
                        });
                    }
                }

                var options = {
                    method: 'POST',
                    uri: `${provenance.apiServerUrl}/activities`,
                    body: activity,
                    headers: {
                        'User-Agent': 'Request-Promise'
                    },
                    json: true
                };

                rp(options)
                    .then(provResponse => {
                        resolve(resource)
                    });
            });
        }
        return null;
    };
}
