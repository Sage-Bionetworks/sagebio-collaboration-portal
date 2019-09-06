import { union } from 'lodash/fp';
import { merge } from 'lodash';
import {
    respondWithResult,
    patchUpdates,
    removeEntity,
    handleEntityNotFound,
    handleError,
} from '../util';
import DataCatalog from './data-catalog.model';
import { isAdmin } from '../../auth/auth';
import { buildEntityIndexQuery } from '../entity-util';
import { getEntityIdsWithEntityPermissionByUser } from '../entity-permission/entity-permission.controller';
import { entityTypes, accessTypes, inviteStatusTypes, entityVisibility } from '../../config/environment';

// Gets a list of DataCatalogs
export function index(req, res) {
    let { filter, projection, sort, skip, limit } = buildEntityIndexQuery(req.query);

    getDataCatalogIdsByUser(req.user._id)
        .then(catalogIds => {
            filter = merge({
                _id: {
                    $in: catalogIds,
                }
            }, filter);
            return filter;
        })
        .then(filter_ => Promise.all([
            DataCatalog.countDocuments(filter_),
            DataCatalog.find(filter_, projection)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('organization')
                .exec()
        ]))
        .then(([count, catalogs]) => ({
            count,
            results: catalogs
        }))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single DataCatalog from the DB
export function show(req, res) {
    return DataCatalog.findById(req.params.id)
        .populate('organization')
        .exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new DataCatalog in the DB
export function create(req, res) {
    Reflect.deleteProperty(req.body, 'createdAt');
    req.body.createdBy = req.user._id.toString();

    return DataCatalog.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Updates an existing DataCatalog in the DB
export function patch(req, res) {
    const patches = req.body.filter(patch => ![
        '_id',
        'createdAt',
        'createdBy'
    ].map(x => `/${x}`).includes(patch.path));

    return DataCatalog.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(patches))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a DataCatalog from the DB
export function destroy(req, res) {
    return DataCatalog.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

// HELPER FUNCTIONS

/**
 * Returns the ids of the public data catalogs.
 * @return {string[]}
 */
export function getPublicDataCatalogIds() {
    return DataCatalog.find({ visibility: entityVisibility.PUBLIC.value }, '_id')
        .exec()
        .then(catalogs => catalogs.map(catalog => catalog._id));
}

/**
 * Returns the ids of the private data catalogs visible to a user.
 * @param {string} userId
 */
export function getPrivateDataCatalogIds(userId) {
    return getEntityIdsWithEntityPermissionByUser(
        userId,
        Object.values(accessTypes).map(access => access.value),
        [inviteStatusTypes.ACCEPTED.value],
        entityTypes.DATA_CATALOG.value
    );
}

/**
 * Returns the ids of all the data catalogs.
 * @return {string[]}
 */
export function getAllDataCatalogIds() {
    return DataCatalog.find({}, '_id')
        .exec()
        .then(catalogs => catalogs.map(catalog => catalog._id));
}

/**
 * Returns the ids of the data catalogs visible to the user.
 * @param {string} userId
 * @return {string[]}
 */
export function getDataCatalogIdsByUser(userId) {
    return isAdmin(userId)
        .then(is =>
            (is
                ? getAllDataCatalogIds()
                : Promise.all([
                    getPublicDataCatalogIds(),
                    getPrivateDataCatalogIds(userId)
                ]).then(result => union(...result))
            )
        );
}
