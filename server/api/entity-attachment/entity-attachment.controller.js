import { pickBy, identity } from 'lodash/fp';
import EntityAttachment from './entity-attachment.model';
import {
    respondWithResult,
    patchUpdates,
    protectFromPatchRemove,
    protectFromPatchReplace,
    removeEntity,
    handleEntityNotFound,
    handleError,
} from '../util';
import { accessTypes, inviteStatusTypes } from '../../config/environment';

// Returns the permissions of the user
export function index(req, res) {
    return EntityAttachment.find(req.query)
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}
