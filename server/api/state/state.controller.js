/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/states              ->  index
 * POST    /api/states              ->  create
 * GET     /api/states/:id          ->  show
 * PUT     /api/states/:id          ->  upsert
 * PATCH   /api/states/:id          ->  patch
 * DELETE  /api/states/:id          ->  destroy
 */

import {
    applyPatch
} from 'fast-json-patch';
import State from './state.model';
import config from '../../config/environment';
var request = require('request');

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
        res.status(statusCode).json({ message: err });
    };
}

// Gets a list of States
export function index(req, res) {
    return State.find().exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single State from the DB
export function show(req, res) {
    return State.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new State in the DB
export function create(req, res) {
  // res.status(500).json({ message: 'Internal Server Error' });

  // State.create(req.body)
  //     .then(respondWithResult(res, 201))
  //     .catch(handleError(res));
  //   State.create(req.body)
  //       .then(state => {
  //           console.log(state);
  //           var url = `${config.provenance.apiServerUrl}/activities`;
  //
  //           var resourceName = 'airway.RDS';
  //           var resourceId = 'cf4b928f-06e7-4049-aa46-06a88dc36830';  // from CKAN
  //           var resourceVersionId = 'v1';
  //           var toolId = '5cb7acb3167e4f14b29dfb1b';  // from mongodb
  //           var toolVersionId = 'v1';
  //           var stateVersionId = 'v1';
  //           var userId = '5cb7acea2d718614d81bb97f';  // adminId but could be anything for now
  //
  //           var body = {
  //               name: `${resourceName}->${state.name}`,
  //               description: state.description,
  //               used: [{
  //                       'targetId': resourceId,
  //                       'targetVersionId': resourceVersionId
  //                   },
  //                   {
  //                       'targetId': toolId,
  //                       'targetVersionId': toolVersionId
  //                   }
  //               ],
  //               generated: [{
  //                   'targetId': state._id,
  //                   'targetVersionId': stateVersionId
  //               }],
  //               agent: [{
  //                   'agentId': userId
  //               }]
  //           };
  //           return request.post(url).form(body);
  //       })
  //       .then(respondWithResult(res, 201))
  //       .catch(handleError(res));


    return State.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Upserts the given State in the DB at the specified ID
export function upsert(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return State.findOneAndUpdate({
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

// Updates an existing State in the DB
export function patch(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return State.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a State from the DB
export function destroy(req, res) {
    return State.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}
