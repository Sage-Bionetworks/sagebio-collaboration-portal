import {
    applyPatch
} from 'fast-json-patch';
import rp from 'request-promise';
import Provenance from './provenance.model';
import config from '../../config/environment';
import {
    respondWithResult,
    handleEntityNotFound,
    handleError,
    convertResponseCase
} from '../util';

// Creates a new activity
export function createProvenanceActivity(req, res) {
    var testBody = {
        "agents": [
            {
                "userId": "agent1",
                "name": "Admin",
                "role": ""
            }
        ],
        "description": "",
        "generated": [
            {
                "role": "",
                "name": "Molecular charecteristics of NSCLC (TCGA)",
                "targetId": "5d00229797146c78d42a33f4",
                "targetVersionId": "1",
                "class": "Insight",
                "subclass": "Report"
            }
        ],
        "name": "DemoActivity2",
        "used": [
            {
                "role": "",
                "name": "PCA on TCGA breast cancer dataset",
                "targetId": "5cb8de033f40db38a280a99e",
                "targetVersionId": "1",
                "class": "Resource",
                "subclass": "State"
            }
        ]
    }
    var options = {
        method: 'POST',
        uri: `${config.provenance.apiServerUrl}/activities/graph`,
        body: testBody,
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
        json: true,
        transform: convertResponseCase(body, response, resolveWithFullResponse)
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
        json: true,
        transform: convertResponseCase
    };

    rp(options)
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}
