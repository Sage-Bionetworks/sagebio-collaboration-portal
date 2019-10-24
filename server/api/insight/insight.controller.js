import { respondWithResult, patchUpdates, handleEntityNotFound, removeEntity, handleError } from '../util';
import Insight from './models/insight.model';
import { union } from 'lodash/fp';
import { merge } from 'lodash';
import { isAdmin } from '../../auth/auth';
import { getPublicProjectIds, getPrivateProjectIds } from '../project/project.controller';
import { buildEntityIndexQuery } from '../entity-util';
import EntityAttachment from '../entity-attachment/entity-attachment.model';

// Returns the Resources visible to the user.
export function index(req, res) {
    let { filter, projection, sort, skip, limit } = buildEntityIndexQuery(req.query, ['insightType', 'projectId']);

    getInsightIdsByUser(req.user._id)
        .then(insightIds => {
            filter = merge(
                {
                    _id: {
                        $in: insightIds,
                    },
                },
                filter
            );
            return filter;
        })
        .then(filter_ =>
            Promise.all([
                Insight.countDocuments(filter_),
                Insight.find(filter_, projection)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .exec(),
            ])
        )
        .then(([count, insights]) => ({
            count,
            results: insights,
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
    return Insight.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Insight in the DB
export function create(req, res) {
    return Insight.create({
        ...req.body,
        createdBy: req.user._id,
    })
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Updates an existing Insight in the DB
export function patch(req, res) {
    Reflect.deleteProperty(req.body, '_id');
    return Insight.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// export function indexByEntity(req, res) {
//     let filters = req.query;
//     filters.projectId = req.params.entityId;
//     return Insight.find(filters)
//         .exec()
//         .then(respondWithResult(res))
//         .catch(handleError(res));
// }

// Deletes an Insight from the DB
export function destroy(req, res) {
    return Insight.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

export function indexAttachments(req, res) {
    return EntityAttachment.find({ parentEntityId: req.params.id })
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

export function createAttachments(req, res) {
    return (
        EntityAttachment.create(req.body)

        // addProvenanceActivityUsed()

            .then(respondWithResult(res, 201))
            .catch(handleError(res))
    );
}

// Deletes an EntityAttachment from the DB.
export function destroyAttachment(req, res) {
    return (
        EntityAttachment.findById(req.params.attachmentId)
            .exec()
            .then(handleEntityNotFound(res))
            // removeProvenanceActivityUsed
            // INPUT:
            // - activityId: getProvenanceActivitiesByReference()
            //   INPUT:
            //   - ID of the insight
            // direction: req.query.direction, => 'up'
            // sortBy: req.query.sortBy, => 'created_at'
            // order: req.query.order, => 'desc'
            // limit: req.query.limit, => 1
            // q: req.query.filter, => '*:*'
            // OUTPUT: returns an array of objects (but length id) [item._id]
            // - referenceId: attachmentId
            .then(attachment => {
                if (attachment) {

                }
                return attachment;
            })
            .then(removeEntity(res))
            .catch(handleError(res))
    );
}

// HELPER FUNCTIONS

/**
 * Returns the ids of the public insights.
 * @return {string[]}
 */
function getPublicInsightIds() {
    return getPublicProjectIds()
        .then(projectIds =>
            Insight.find(
                {
                    projectId: {
                        $in: projectIds,
                    },
                },
                '_id'
            ).exec()
        )
        .then(insights => insights.map(insight => insight._id));
}

/**
 * Returns the ids of the private insights visible to a user.
 * @param {string} userId
 */
function getPrivateInsightIds(userId) {
    return getPrivateProjectIds(userId)
        .then(projectIds =>
            Insight.find(
                {
                    projectId: {
                        $in: projectIds,
                    },
                },
                '_id'
            ).exec()
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
    return isAdmin(userId).then(is =>
        (is
            ? getAllInsightIds()
            : Promise.all([getPublicInsightIds(), getPrivateInsightIds(userId)]).then(result => union(...result)))
    );
}
