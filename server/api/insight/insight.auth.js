import compose from 'composable-middleware';
import * as auth from '../../auth/auth.service';
import * as authBase from '../../auth/auth';
import { entityTypes, accessTypes } from '../../config/environment';
import Insight from './models/insight.model';
import Project from '../project/project.model';

/**
 * Resolves as true if the project associated to the insight is public
 * OR if the user has at least the Read permission for the project.
 */
export function canReadInsight() {
    return auth.canReadEntity(
        attachInsightAuthorizationDetails(),
        Object.values(accessTypes).map(access => access.value)
    );
}

/**
 * Resolves as true if the user has at least the Write permission for the project.
 */
export function canCreateInsight() {
    return auth.hasEntityPermission(
        attachInsightAuthorizationDetailsForCreate(),
        [accessTypes.WRITE.value, accessTypes.ADMIN.value]
    );
}

/**
 * Resolves as true if the user has the Admin permission for the project
 * OR (the user has at least the Read permission to the project AND is the
 * owner of the insight).
 */
export function canEditInsight() {
    return compose()
        .use(auth.isAuthenticated())
        .use(attachInsightAuthorizationDetails())
        .use((req, res, next) => new Promise(async resolve => {
            // Check if the user is an admin of the project
            const isProjectAdmin = await authBase.hasEntityPermission(
                req.user._id,
                req.entity._id,
                req.entity.entityType,
                [accessTypes.ADMIN.value]
            );
            // Check if the user has write access to the project
            // AND is the owner of the Insight
            const isInsightOwner = await authBase.isEntityOwner(
                req.user._id,
                req.entity._id,
                req.entity.entityType,
                req.entity.createdBy,
                [accessTypes.ADMIN.value]
            );

            resolve(isProjectAdmin || isInsightOwner);
        })
            .then(isAuthorized => {
                if (isAuthorized) {
                    return next();
                }
                return null;
            })
            .catch(() => {
                res.status(403).send('Forbidden');
                return null;
            })
        );
}

/**
 * Resolves as true if the user has the Admin permission for this project.
 */
export function canDeleteInsight() {
    return auth.hasEntityPermission(
        attachInsightAuthorizationDetails(),
        [accessTypes.ADMIN.value]
    );
}

// HELPER FUNCTIONS

/**
 * Attaches information about the project associated to a insight to the request object.
 */
function attachInsightAuthorizationDetails() {
    return compose().use((req, res, next) => {
        return Insight.findById(req.params.id, 'projectId createdBy')
            .exec()
            .then(insight => {
                if (!insight) {
                    return res.status(403).end();
                }
                return Project.findById(insight.projectId, '_id visibility')
                    .exec()
                    .then(project => {
                        if (!project) {
                            return res.status(403).end();
                        }
                        req.entity = {
                            _id: project._id,
                            entityType: entityTypes.PROJECT.value,
                            visibility: project.visibility,
                            createdBy: insight.createdBy
                        };
                        next();
                        return null;
                    });
            })
            .catch(err => next(err));
    });
}

function attachInsightAuthorizationDetailsForCreate() {
    return compose().use((req, res, next) => {
        if (!req.body || !req.body.projectId) {
            return res.status(400).end();
        }
        return Project.findById(req.body.projectId, '_id visibility')
            .exec()
            .then(project => {
                if (!project) {
                    return res.status(403).end();
                }
                req.entity = {
                    _id: project._id,
                    entityType: entityTypes.PROJECT.value,
                    // visibility: project.visibility,
                    // createdBy: insight.createdBy
                };
                next();
                return null;
            });
    });
}
