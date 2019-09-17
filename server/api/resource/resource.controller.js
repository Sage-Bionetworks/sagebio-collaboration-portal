import { union } from 'lodash/fp';
import { merge } from 'lodash';
import { isAdmin } from '../../auth/auth';
import { respondWithResult, patchUpdates, removeEntity, handleEntityNotFound, handleError } from '../util';
import { getPublicProjectIds, getPrivateProjectIds } from '../project/project.controller';
import { buildEntityIndexQuery } from '../entity-util';
import Resource from './models/resource.model';

import rp from 'request-promise';
import config from '../../config/environment';

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
    return Resource.create({
        ...req.body,
        createdBy: req.user._id,
    })
        .then(resource => {
            console.log('post resource', resource);
            if (resource && resource.tool && resource.tool._id && resource.tool._id.toString() === '5cb7acb3167e4f14b29dfb1b') { // phccpShinyToolExample TODO Remove
                // POST TO PROVENANCE
                let body = {
                    'agents': [{
                        'userId': req.user._id,
                        'name': 'Admin', // HACK
                        'role': ''
                    }],
                    'description': resource.description,
                    'class': 'ToolSession', // TODO Correct?
                    'generated': [{
                        'name': resource.title,
                        'role': '',
                        'targetId': resource._id,
                        'targetVersionId': '1',
                        'class': 'Resource',
                        'subclass': resource.resourceType
                    }],
                    'name': `Creation of ${resource.title}`,
                    'used': [
                        {
                            'name': 'PHCCP Shiny Tool Example', // HACK
                            'role': '',
                            'targetId': resource.tool._id,
                            'targetVersionId': '1',
                            'class': 'Tool',
                            'subclass': 'Tool'
                        }
                    ]
                };
                var options = {
                    method: 'POST',
                    uri: `${config.provenance.apiServerUrl}/activities`,
                    body: body,
                    headers: {
                        'User-Agent': 'Request-Promise'
                    },
                    json: true
                };

                return rp(options)
                    .then(provResponse => {
                        console.log('Provenance response', provResponse);
                        return resource;
                    });
                    // .then(handleEntityNotFound(res))
                    // .then(respondWithResult(res))
                    // .catch(handleError(res));

                // NOT RETURNING OUTPUT OF rp
            }
            return resource;
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
