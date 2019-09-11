import {
    applyPatch
} from 'fast-json-patch';
import rp from 'request-promise';
import Provenance from './provenance.model';
import config from '../../config/environment';
import {
    respondWithResult,
    handleEntityNotFound,
    handleError
} from '../util';


// Creates a new activity
export function createProvenanceActivity(req, res) {
    var options = {
        method: 'POST',
        uri: `${config.provenance.apiServerUrl}/activities`,
        body: req.body,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };

    rp(options)
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates multiple activities
export function createActivitiesBatch(req, res) {
    createActivities(req.body)
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
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
        .then(handleEntityNotFound(res))
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
        .then(handleEntityNotFound(res))
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
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// HELPER FUNCTIONS

export function createActivities(activities) {
    var options = {
        method: 'POST',
        uri: `${config.provenance.apiServerUrl}/activities/batch`,
        body: activities,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };

    return rp(options);
}
