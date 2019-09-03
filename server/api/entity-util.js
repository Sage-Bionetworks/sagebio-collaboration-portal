import { pick } from 'lodash/fp';

/**
 * Builds Mongoose filter, projection, sort, skip and limit for indexing entities.
 * @param {*} query
 */
export function buildEntityIndexQuery(query) {
    let filter = {};
    let projection = {};
    let sort = 'createdAt'; // TODO UI and backend should use same default value

    const maxPageSize = 50;
    const pageSize = 2;
    let skip = query.page
        ? query.page * pageSize
        : 0;
    let limit = query.limit
        ? Math.max(Math.min(1, query.limit), maxPageSize)
        : pageSize;

    if (query) {
        filter = pick(['resourceType', 'insightType'], query);

        if (query.searchTerms) {
            filter.$text = {
                $search: query.searchTerms,
                $caseSensitive: false,
                $diacriticSensitive: true
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
        limit
    };
}
