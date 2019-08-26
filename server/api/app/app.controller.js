
import {
    respondWithResult,
    handleEntityNotFound,
    handleError
} from '../util';
import App from './app.model';
import { appId } from '../../config/seeds/default/constants';

export function show(req, res) {
    return App.findById(appId)
        .exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}
