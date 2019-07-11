import {
    applyPatch
} from 'fast-json-patch';
import Tool from './tool.model';

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

function patchUpdates(patches) {
    return function (entity) {
        try {
            applyPatch(entity, patches, /*validate*/ true);
        } catch (err) {
            return Promise.reject(err);
        }

        return entity.save();
    };
}

function removeEntity(res) {
    return function (entity) {
        if (entity) {
            return entity.remove()
                .then(() => res.status(204).end());
        }
    };
}

function handleEntityNotFound(res) {
    return function (entity) {
        if (!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function (err) {
        console.log('ERROR', err);
        res.status(statusCode).send(err);
    };
}

// Gets a list of Tools
export function index(req, res) {
    return Tool.find(req.query)
        .populate('organization')
        .exec()
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
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
        Reflect.deleteProperty(req.body, 'createdAt');
        Reflect.deleteProperty(req.body, 'createdBy');
    }
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
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
        Reflect.deleteProperty(req.body, 'createdAt');
        Reflect.deleteProperty(req.body, 'createdBy');
    }
    return Tool.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
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
