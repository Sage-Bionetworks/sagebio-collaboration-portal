import {
    applyPatch
} from 'fast-json-patch';
import { snakeCase, isPlainObject, forOwn } from 'lodash'
import {
    find
} from 'lodash/fp';


function deepMapKeys(obj, fn) {
    var x = {};

    forOwn(obj, function(v, k) {
        if(isPlainObject(v))
            v = deepMapKeys(v, fn);
        x[fn(v, k)] = v;
    });

    return x;
}

export function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

export function convertResponseCase(body, response, resolveWithFullResponse) {
        let snakeCaseObject = deepMapKeys(response.body, (v, k) => snakeCase(k));
        response.body = snakeCaseObject;
        return resolveWithFullResponse ? response : response.body;
}

export function patchUpdates(patches) {
    return function (entity) {
        if (entity) {
            try {
                applyPatch(entity, patches, /*validate*/ true);
            } catch (err) {
                return Promise.reject(err);
            }
            return entity.save();
        }
        return null;
    };
}

export function protectFromPatchReplace(res, patches, allowedProperties) {
    return function (entity) {
        let invalid = patches.find(patch =>
            patch.op === 'replace' && !allowedProperties.includes(patch.path.substring(1))
        );
        if (invalid) {
            res.status(400).send(`Only the following document properties ` +
                `can be replaced: ${allowedProperties.join(' ')}`);
            return null;
        }
        return entity;
    }
}

export function protectFromPatchRemove(res, patches, allowedProperties) {
    return function (entity) {
        let invalid = patches.find(patch =>
            patch.op === 'remove' && !allowedProperties.includes(patch.path.substring(1))
        );
        if (invalid) {
            res.status(400).send(`Only the following document properties ` +
                `can be removed: ${allowedProperties.join(' ')}`);
            return null;
        }
        return entity;
    }
}

export function removeEntity(res) {
    return function (entity) {
        if (entity) {
            return entity.remove()
                .then(() => res.status(204).end());
        }
    };
}

export function handleEntityNotFound(res) {
    return function (entity) {
        if (!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

export function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function (err) {
        console.log(err);
        res.status(statusCode).send(err.message || err);
    };
}
