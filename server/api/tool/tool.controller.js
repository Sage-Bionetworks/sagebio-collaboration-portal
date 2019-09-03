
import { union } from 'lodash/fp';
import { merge } from 'lodash';
import {
    respondWithResult,
    patchUpdates,
    removeEntity,
    handleEntityNotFound,
    handleError,
} from '../util';
import Tool from './tool.model';
import { isAdmin } from '../../auth/auth';
import { buildEntityIndexQuery } from '../entity-util';
import { getEntityIdsWithEntityPermissionByUser } from '../entity-permission/entity-permission.controller';
import { entityTypes, accessTypes, inviteStatusTypes, entityVisibility } from '../../config/environment';

// Gets a list of Tools
export function index(req, res) {
    let { filter, projection, sort, skip, limit } = buildEntityIndexQuery(req.query);

    getToolIdsByUser(req.user._id)
        .then(toolIds => {
            filter = merge({
                _id: {
                    $in: toolIds,
                }
            }, filter);
            return filter;
        })
        .then(filter_ => Promise.all([
            Tool.countDocuments(filter_),
            Tool.find(filter_, projection)
                .populate('organization')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec()
        ]))
        .then(([count, tools]) => ({
            count,
            results: tools
        }))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Tool from the DB
export function show(req, res) {
    return Tool.findById(req.params.id)
        .populate('organization')
        .exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Tool in the DB
export function create(req, res) {
    Reflect.deleteProperty(req.body, 'createdAt');
    req.body.createdBy = req.user._id.toString();

    return Tool.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Upserts the given Tool in the DB at the specified ID
export function upsert(req, res) {
    Reflect.deleteProperty(req.body, '_id');
    Reflect.deleteProperty(req.body, 'createdAt');
    Reflect.deleteProperty(req.body, 'createdBy');

    return Tool.findOneAndUpdate({
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

// Updates an existing Tool in the DB
export function patch(req, res) {
    const patches = req.body.filter(patch => ![
        '_id',
        'createdAt',
        'createdBy'
    ].map(x => `/${x}`).includes(patch.path));

    return Tool.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(patches))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Tool from the DB
export function destroy(req, res) {
    return Tool.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

// HELPER FUNCTIONS

/**
 * Returns the ids of the public tools.
 * @return {string[]}
 */
export function getPublicToolIds() {
    return Tool.find({ visibility: entityVisibility.PUBLIC.value }, '_id')
        .exec()
        .then(tools => tools.map(tool => tool._id));
}

/**
 * Returns the ids of the private tools visible to a user.
 * @param {string} userId
 */
export function getPrivateToolIds(userId) {
    return getEntityIdsWithEntityPermissionByUser(
        userId,
        Object.values(accessTypes).map(access => access.value),
        [inviteStatusTypes.ACCEPTED.value],
        entityTypes.TOOL.value
    );
}

/**
 * Returns the ids of all the tools.
 * @return {string[]}
 */
export function getAllToolIds() {
    return Tool.find({}, '_id')
        .exec()
        .then(tools => tools.map(tool => tool._id));
}

/**
 * Returns the ids of the tools visible to the user.
 * @param {string} userId
 * @return {string[]}
 */
export function getToolIdsByUser(userId) {
    return isAdmin(userId)
        .then(is =>
            (is
                ? getAllToolIds()
                : Promise.all([
                    getPublicToolIds(),
                    getPrivateToolIds(userId)
                ]).then(result => union(...result))
            )
        );
}
