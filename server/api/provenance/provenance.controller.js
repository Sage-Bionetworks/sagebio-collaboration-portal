import { applyPatch } from 'fast-json-patch';
import rp from 'request-promise';
import Provenance from './provenance.model';
import config from '../../config/environment';
import { respondWithResult, handleEntityNotFound, handleError } from '../util';

// Creates a new activity
export function createProvenanceActivity(req, res) {
    var options = {
        method: 'POST',
        uri: `${config.provenance.apiServerUrl}/activities`,
        body: req.body,
        headers: {
            'User-Agent': 'Request-Promise',
        },
        json: true,
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
            sortBy: req.query.sortBy,
            order: req.query.order,
            limit: req.query.limit,
            q: req.query.filter,
        },
        headers: {
            'User-Agent': 'Request-Promise',
        },
        json: true,
    };

    rp(options)
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Returns the provenance subgraph for a user
export function getProvenanceGraphByAgent(req, res) {
    var agentId = req.params.agentId;
    var options = {
        method: 'GET',
        uri: `${config.provenance.apiServerUrl}/activities/byAgent/${agentId}/graph`,
        headers: {
            'User-Agent': 'Request-Promise',
        },
        qs: {
            sortBy: req.query.sortBy,
            order: req.query.order,
            limit: req.query.limit,
            q: req.query.filter,
        },
        json: true,
    };

    rp(options)
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Returns the provenance subgraph for an entity
export function getProvenanceGraphByReference(req, res) {
    var referenceId = req.params.referenceId;
    var options = {
        method: 'GET',
        uri: `${config.provenance.apiServerUrl}/activities/byReference/${referenceId}/graph`,
        headers: {
            'User-Agent': 'Request-Promise',
        },
        qs: {
            direction: req.query.direction,
            sortBy: req.query.sortBy,
            order: req.query.order,
            limit: req.query.limit,
            q: req.query.filter,
        },
        json: true,
    };

    rp(options)
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Returns the provenance activity objects for an entity
export function getProvenanceActivitiesByReference(req, res) {
    // var referenceId = req.params.referenceId;
    // var options = {
    //     method: 'GET',
    //     uri: `${config.provenance.apiServerUrl}/activities/byReference/${referenceId}`,
    //     headers: {
    //         'User-Agent': 'Request-Promise',
    //     },
    //     qs: {
    //         direction: req.query.direction,
    //         sortBy: req.query.sortBy,
    //         order: req.query.order,
    //         limit: req.query.limit,
    //         q: req.query.filter,
    //     },
    //     json: true,
    // };

    // rp(options)
    //     .then(handleEntityNotFound(res))
    //     .then(respondWithResult(res))
    //     .catch(handleError(res));

    let referenceId = req.params.referenceId;
    let options = {
        direction: req.query.direction,
        sortBy: req.query.sortBy,
        order: req.query.order,
        limit: req.query.limit,
        filter: req.query.filter,
    };

    getProvenanceActivitiesByReferenceCore(referenceId, options)
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

export function getProvenanceActivitiesByReferenceCore(
    referenceId,
    options = {
        direction: 'up',
        sortBy: 'created_at',
        order: 'desc',
        limit: 1,
        filter: '*:*',
    }
) {
    var request = {
        method: 'GET',
        uri: `${config.provenance.apiServerUrl}/activities/byReference/${referenceId}`,
        headers: {
            'User-Agent': 'Request-Promise',
        },
        qs: {
            direction: options.direction,
            sortBy: options.sortBy,
            order: options.order,
            limit: options.limit,
            q: options.filter,
        },
        json: true,
    };

    return rp(request);
}

// Add 'used' reference entity to a provenance activity
export function addProvenanceActivityUsed(req, res) {
    var activityId = req.params.activityId;
    var options = {
        method: 'PUT',
        uri: `${config.provenance.apiServerUrl}/activities/${activityId}/used`,
        body: req.body,
        headers: {
            'User-Agent': 'Request-Promise',
        },
        json: true,
    };

    rp(options)
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Remove 'used' reference entity from a provenance activity
export function removeProvenanceActivityUsed(req, res) {
    var activityId = req.params.activityId;
    var referenceId = req.params.referenceId;

    var options = {
        method: 'DELETE',
        uri: `${config.provenance.apiServerUrl}/activities/${activityId}/used/${referenceId}`,
        headers: {
            'User-Agent': 'Request-Promise',
        },
        json: true,
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
            'User-Agent': 'Request-Promise',
        },
        json: true,
    };

    return rp(options);
}
