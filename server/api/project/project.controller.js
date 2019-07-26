import {
    applyPatch
} from 'fast-json-patch';
import Project from './project.model';
import EntityPermission from '../entity-permission/entity-permission.model';
import {
    entityTypes,
    accessTypes,
    inviteStatusTypes
} from '../../config/environment';
import {
    respondWithResult,
    patchUpdates,
    protectFromPatchRemove,
    protectFromPatchReplace,
    removeEntity,
    handleEntityNotFound,
    handleError
} from '../util';

// Gets a list of Projects
export function index(req, res) {
    // res.status(500).json({ message: 'You can not list the projects' });
    return Project.find().exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Project from the DB
export function show(req, res) {
    return Project.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Project in the DB
export function create(req, res) {
    Reflect.deleteProperty(req.body, 'createdAt');
    req.body.createdBy = req.user._id.toString();
    console.log('here', entityTypes.PROJECT.value);

    return Project.create(req.body)
        .then(createAdminPermissionForEntity(req.user, entityTypes.PROJECT.value))
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Updates an existing Project in the DB
export function patch(req, res) {
    const patches = req.body.filter(patch => ![
        '_id',
        'createdAt',
        'createdBy'
    ].map(x => `/${x}`).includes(patch.path));

    return Project.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(patches))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Project from the DB
export function destroy(req, res) {
    return Project.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

// HELPER FUNCTIONS

function createAdminPermissionForEntity(user, entityType) {
    return function (entity) {
        if (entity) {
            return EntityPermission.create({
                    entityId: entity._id.toString(),
                    entityType: entityType,
                    user: user._id.toString(),
                    access: accessTypes.ADMIN.value,
                    status: inviteStatusTypes.ACCEPTED.value,
                    createdBy: user._id.toString()
                })
                .then(() => entity)
                .catch(err => console.log(err));
        }
        return null;
    };
}
