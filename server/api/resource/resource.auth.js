import compose from 'composable-middleware';
import {
    canReadEntity,
    hasEntityPermission
} from '../../auth/auth.service';
import { entityTypes, accessTypes } from '../../config/environment';
import Resource from './models/resource.model';
import Project from '../project/project.model';

/**
 * Resolves as true if the project associated to the resource is public
 * OR if the user has at least the Read permission for the project.
 */
export function canReadResource() {
    return canReadEntity(
        attachResourceAuthorizationDetails(),
        Object.values(accessTypes).map(access => access.value)
    );
}

/**
 * Resolves as true if the user has at least the Write permission for the project.
 */
export function canCreateResource() {
    return hasEntityPermission(
        attachResourceAuthorizationDetails(),
        [accessTypes.WRITE.value, accessTypes.ADMIN.value]
    );
}

/**
 * Resolves as true if the user has the Admin permission for the project
 * OR (the user has at least the Read permission to the project AND is the
 * owner of the resource).
 */
export function canEditResource() {

}

// HELPER FUNCTIONS

/**
 * Attaches information about the project associated to a resource to the request object.
 */
function attachResourceAuthorizationDetails() {
    return compose().use((req, res, next) => {
        Resource.findById(req.params.id, 'projectId')
            .exec()
            .then(resource => {
                if (!resource) {
                    return res.status(403).end();
                }
                return Project.findById(resource.projectId, '_id visibility')
                    .exec()
                    .then(project => {
                        if (!project) {
                            return res.status(403).end();
                        }
                        req.entity = {
                            _id: project._id,
                            entityType: entityTypes.PROJECT.value,
                            visibility: project.visibility,
                        };
                        next();
                        return null;
                    });
            })
            .catch(err => next(err));
    });
}
