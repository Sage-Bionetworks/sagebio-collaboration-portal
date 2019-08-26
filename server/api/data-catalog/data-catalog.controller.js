import {
    respondWithResult,
    patchUpdates,
    removeEntity,
    handleEntityNotFound,
    handleError,
} from '../util';
import DataCatalog from './data-catalog.model';

// Gets a list of DataCatalogs
export function index(req, res) {
    return DataCatalog.find(req.query)
        .populate('organization')
        .exec()
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

// Upserts the given DataCatalog in the DB at the specified ID
export function upsert(req, res) {
    Reflect.deleteProperty(req.body, '_id');
    Reflect.deleteProperty(req.body, 'createdAt');
    Reflect.deleteProperty(req.body, 'createdBy');

    return DataCatalog.findOneAndUpdate({
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
