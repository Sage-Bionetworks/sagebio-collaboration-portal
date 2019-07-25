import {
    applyPatch
} from 'fast-json-patch';
import rp from 'request-promise';
import Provenance from './provenance.model';
import config from '../../config/environment';

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
        res.status(statusCode).send(err);
    };
}

// Returns the entire provenance graph
export function getProvenanceGraph(req, res) {
    var options = {
        method: 'GET',
        uri: `${config.provenance.apiServerUrl}/activities/graph`,
        qs: {
            'sortBy': req.query.sortBy,
            'order': req.query.order,
            'limit': req.query.limit
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };

    rp(options)
        .then(respondWithResult(res))
        .catch(handleError(res));

    }

// Returns the provenance subgraph for a user
export function getProvenanceGraphByAgent(req, res) {
    var agentId = req.params.agentId
    var options = {
        uri: `${config.provenance.apiServerUrl}/activities/byAgent/${agentId}/graph`,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        qs: {
            'sortBy': req.query.sortBy,
            'order': req.query.order,
            'limit': req.query.limit
        },
        json: true
    };

    rp(options)
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Returns the provenance subgraph for an entity
export function getProvenanceGraphByReference(req, res) {
    var referenceId = req.params.referenceId
    var options = {
        uri: `${config.provenance.apiServerUrl}/activities/byReference/${referenceId}/graph`,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        qs: {
            'direction': req.query.direction,
            'sortBy': req.query.sortBy,
            'order': req.query.order,
            'limit': req.query.limit
        },
        json: true
    };

    rp(options)
        .then(respondWithResult(res))
        .catch(handleError(res));
}
