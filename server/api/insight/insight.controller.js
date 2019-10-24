import { respondWithResult, patchUpdates, handleEntityNotFound, removeEntity, handleError } from '../util';
import Insight from './models/insight.model';
import { union } from 'lodash/fp';
import { merge } from 'lodash';
import { isAdmin } from '../../auth/auth';
import { getPublicProjectIds, getPrivateProjectIds } from '../project/project.controller';
import { buildEntityIndexQuery } from '../entity-util';
import EntityAttachment from '../entity-attachment/entity-attachment.model';
import {
    getProvenanceActivitiesByReferenceCore,
    removeProvenanceActivityUsedCore,
    addProvenanceActivityUsedCore,
    createProvenanceActivityCore,
} from '../provenance/provenance.controller';
import DataCatalog from '../data-catalog/data-catalog.model';
import Tool from '../tool/tool.model';
import Resource from '../resource/models/resource.model';

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
    let user = req.user;

    return Insight.create({
        ...req.body,
        createdBy: req.user._id,
    })
        .then(insight => {
            if (insight) {
                let activity = {
                    agents: [
                        {
                            userId: user._id,
                            name: user.name,
                            role: user.role,
                        },
                    ],
                    description: '',
                    class: `${insight.insightType}Creation`, // TODO Use enum
                    generated: [
                        {
                            name: insight.title,
                            role: '',
                            targetId: insight._id,
                            targetVersionId: '1',
                            class: 'Insight', // TODO Use enum
                            subclass: insight.insightType,
                        },
                    ],
                    name: `Creation of ${insight.title}`,
                    used: [],
                };

                return createProvenanceActivityCore(activity).then(() => insight);
            }
            return null;
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
            .then(attachments => {
                if (attachments) {
                    console.log('ATTACHMENTS', attachments);
                    // TODO: The current implementation of provenance requires
                    // to specify the entity name. Need to do an extra query to
                    // get this information (will no longer be needed hopefully
                    // in the future).

                    let promises = attachments.map(attachment => {
                        let model = null;
                        switch (attachment.entityType) {
                        case 'DataCatalog':
                            model = DataCatalog;
                            break;
                        case 'Tool':
                            model = Tool;
                            break;
                        case 'Insight':
                            model = Insight;
                            break;
                        case 'Resource':
                            model = Resource;
                            break;
                        default:
                            throw new Error('Unsupported type of attachment');
                        }

                        model
                            .findById(attachment.entityId)
                            .then(entity => {
                                if (entity) {
                                    return {
                                        name: entity.title,
                                        role: '',
                                        targetId: attachment.entityId,
                                        targetVersionId: '1',
                                        class: attachment.entityType,
                                        subsclass: attachment.entitySubType,
                                    };
                                }
                                throw new Error('Entity not found', attachment.entityId);
                            })
                            .then(usedEntity => {
                                console.log('usedEntity', usedEntity);
                                let options = {
                                    direction: 'up',
                                    sortBy: 'created_at',
                                    order: 'desc',
                                    limit: 1,
                                    filter: '*:*',
                                };
                                return getProvenanceActivitiesByReferenceCore(attachment.parentEntityId, options)
                                    .then(activities => {
                                        let activity = activities[0];
                                        console.log('ACTIVITY FOUND:', activity);
                                        return addProvenanceActivityUsedCore(activity.id, usedEntity);
                                    })
                                    .then(() => attachment);
                            });
                    });

                    return Promise.all(promises).then(() => {
                        console.log('Success');
                        return attachments;
                    });
                }
            })
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
                console.log('Deleting attachment', attachment);
                if (attachment) {
                    let options = {
                        direction: 'up',
                        sortBy: 'created_at',
                        order: 'desc',
                        limit: 1,
                        filter: '*:*',
                    };
                    return getProvenanceActivitiesByReferenceCore(attachment.parentEntityId, options)
                        .then(activities => {
                            let activity = activities[0];
                            console.log('ACTIVITY FOUND:', activity);
                            return removeProvenanceActivityUsedCore(activity.id, attachment._id);
                        })
                        .then(() => attachment);
                }
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
