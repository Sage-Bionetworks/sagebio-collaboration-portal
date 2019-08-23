import {
    applyPatch
} from 'fast-json-patch';
import { mapKeys, mapValues, snakeCase, isPlainObject, isArray } from 'lodash';
import {
    find
} from 'lodash/fp';

function deeply(map) {
    var deeplyArray = function (obj, fn) {
      return obj.map(function(x) {
        return isPlainObject(x) ? deeply(map)(x, fn) : x;
      })
    }

    return function (obj, fn) {
      if (isArray(obj)) {
        return deeplyArray(obj, fn);
      }

      return map(mapValues(obj, function (v) {
        return isPlainObject(v) ? deeply(map)(v, fn) : isArray(v) ?
          deeplyArray(v, fn) : v;
      }), fn);
    }
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
        let snakeCaseObject = deeply(mapKeys)(response.body, (v, k) => snakeCase(k));
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

function handleUserNotFound(res) {
    return function(user) {
        if (!user) {
            res.status(401).end();
            return null;
        }
        return user;
    };
}

export function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function (err) {
        console.log(err);
        res.status(statusCode).send(err.message || err);
    };
}
