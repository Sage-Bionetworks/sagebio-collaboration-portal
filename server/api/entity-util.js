import { pick } from 'lodash/fp';
import EntityPermission from '../api/entity-permission/entity-permission.model';
import { accessTypes, inviteStatusTypes } from '../config/environment';

/**
 * Builds Mongoose filter, projection, sort, skip and limit for indexing entities.
 * @param {*} query
 */
export function buildEntityIndexQuery(query, filterProperties = []) {
    let filter = {};
    let projection = {};
    let sort = 'createdAt'; // TODO UI and backend should use same default value

    const maxPageSize = 50;
    const pageSize = 20;
    let skip = query.page ? query.page * pageSize : 0;
    let limit = query.limit ? Math.max(Math.min(1, query.limit), maxPageSize) : pageSize;

    if (query) {
        filter = pick(filterProperties, query);

        if (query.searchTerms) {
            filter.$text = {
                $search: query.searchTerms,
                $caseSensitive: false,
                $diacriticSensitive: true,
            };
            projection.score = { $meta: 'textScore' };
            if (query.orderedBy === 'relevance') {
                sort = { score: { $meta: 'textScore' } };
            }
        }

        if (query.orderedBy !== 'relevance') {
            sort = query.orderedBy;
        }
    }

    return {
        filter,
        projection,
        sort,
        skip,
        limit,
    };
}

/**
 * Creates an entity-permission with Admin access for the user and entity specified.
 * @param {*} user
 * @param {*} entityType
 */
export function createAdminPermissionForEntity(user, entityType) {
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
