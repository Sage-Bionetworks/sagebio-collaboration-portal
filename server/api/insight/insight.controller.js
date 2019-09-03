import {
    respondWithResult,
    patchUpdates,
    handleEntityNotFound,
    handleError
} from '../util';
import Insight from './models/insight.model';
import { union } from 'lodash/fp';
import { merge } from 'lodash';
import { isAdmin } from '../../auth/auth';
import { getPublicProjectIds, getPrivateProjectIds } from '../project/project.controller';
import { buildEntityIndexQuery } from '../entity-util';

// Returns the Resources visible to the user.
export function index(req, res) {
    let { filter, projection, sort, skip, limit } = buildEntityIndexQuery(req.query);

    getInsightIdsByUser(req.user._id)
        .then(insightIds => {
            filter = merge({
                _id: {
                    $in: insightIds,
                }
            }, filter);
            return filter;
        })
        .then(filter_ => Promise.all([
            Insight.countDocuments(filter_),
            Insight.find(filter_, projection)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec()
        ]))
        .then(([count, insights]) => ({
            count,
            results: insights
        }))
        .then(respondWithResult(res))
        .catch(handleError(res));
}




export function indexByEntity(req, res) {
    let filters = req.query;
    filters.projectId = req.params.entityId;
    return Insight.find(filters)
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Insight from the DB
export function show(req, res) {
    return Insight
        .findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Insight in the DB
export function create(req, res) {
    return Insight.create({
        ...req.body,
        createdBy: req.user._id
    })
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Upserts the given Insight in the DB at the specified ID
export function upsert(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Insight
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

// Updates an existing Insight in the DB
export function patch(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Insight.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// // Deletes a Insight from the DB
// export function destroy(req, res) {
//     return Insight.findById(req.params.id).exec()
//         .then(handleEntityNotFound(res))
//         .then(removeEntity(res))
//         .catch(handleError(res));
// }


// HELPER FUNCTIONS

/**
 * Returns the ids of the public insights.
 * @return {string[]}
 */
function getPublicInsightIds() {
    return getPublicProjectIds()
        .then(projectIds => Insight.find({
            projectId: {
                $in: projectIds
            }}, '_id')
            .exec()
        )
        .then(insights => insights.map(insight => insight._id));
}

/**
 * Returns the ids of the private insights visible to a user.
 * @param {string} userId
 */
function getPrivateInsightIds(userId) {
    return getPrivateProjectIds(userId)
        .then(projectIds => Insight.find({
            projectId: {
                $in: projectIds
            }}, '_id')
            .exec()
        )
        .then(insights => insights.map(insight => insight._id));
}

/**
 * Returns the ids of all the insights.
 * @return {string[]}
 */
function getAllInsightIds() {
    return Insight.find({}, '_id')
        .exec()
        .then(insights => insights.map(insight => insight._id));
}

/**
 * Returns the ids of the insights visible to the user.
 * @param {string} userId
 * @return {string[]}
 */
function getInsightIdsByUser(userId) {
    return isAdmin(userId)
        .then(is =>
            (is
                ? getAllInsightIds()
                : Promise.all([
                    getPublicInsightIds(),
                    getPrivateInsightIds(userId)
                ]).then(result => union(...result))
            )
        );
}
