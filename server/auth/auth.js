import User from '../api/user/user.model';
import UserPermission from '../api/user-permission/user-permission.model';
import EntityPermission from '../api/entity-permission/entity-permission.model';
import Insight from '../api/insight/models/insight.model';
import Resource from '../api/resource/models/resource.model';
import Tool from '../api/tool/tool.model';
import DataCatalog from '../api/data-catalog/data-catalog.model';
import Project from '../api/project/project.model';
import config from '../config/environment';

/**
 * Resolves as true if the user has the requested role.
 *
 * @param {string} userId
 * @param {string} role
 * @return {Promise<boolean>}
 */
export function hasRole(userId, role) {
    return new Promise(resolve => {
        User.findById(userId)
            .exec()
            .then(user => {
                if (user) {
                    const roles = Object.values(config.userRoles).map(r => r.value);
                    const userHasRole = roles.indexOf(user.role) === roles.indexOf(role);
                    return resolve(userHasRole);
                }
                return resolve(false);
            });
    });
}

/**
 * Resolves as true if the user is an admin.
 *
 * @param {string} userId
 * @return {Promise<boolean>}
 */
export function isAdmin(userId) {
    return hasRole(userId, config.userRoles.ADMIN.value);
}

/**
 * Resolves as true if the user has a portal admin role OR if the user has created the object.
 * TODO: Pass entityId and check fif the user is an admin of the entity?
 *
 * @param {*} userId
 * @param {*} createdByUserId
 */
export function isOwner(userId, createdByUserId) {
    return new Promise(resolve => {
        const _isAdmin = async () => await isAdmin(userId);
        if (_isAdmin) {
            return resolve(true);
        }
        return resolve(userId === createdByUserId);
    });
}

/**
 * Resolves as true if the user has access to the specified entity.
 *
 * ASSUMPTION: MongoDB Object ID are unique at the database level (in reality at the collection level).
 *
 * @param {string} userId
 * @param {string} allowedAccesses
 * @param {string} entityId
 * @return {Promise<boolean>}
 */
export function hasAccessToEntity(
    userId,
    allowedAccesses,
    entityId,
    allowedAccessStatus = [config.inviteStatusTypes.ACCEPTED.value]
) {
    return new Promise(resolve => {
        if (!allowedAccesses) {
            return resolve(false);
        }

        return isAdmin(userId)
            .then(isAuthorized =>
                (!isAuthorized
                    ? Tool
                        .findById(entityId)
                        .exec()
                        .then(tool => !!tool) // tool are currently public
                    : isAuthorized)
            )
            .then(isAuthorized =>
                (!isAuthorized
                    ? DataCatalog
                        .findById(entityId)
                        .exec()
                        .then(catalog => !!catalog) // data catalog are currently public
                    : isAuthorized)
            )
            .then(isAuthorized =>
                (!isAuthorized
                    ? Project
                        .findById(entityId)
                        .exec()
                        .then(project => !!project && project.visibility === 'Public') // project is public
                    : isAuthorized)
            )
            .then(isAuthorized =>
                (!isAuthorized
                    ? Project
                        .findById(entityId)
                        .then(project => project && project._id)
                        .then(entityIdToCheck =>
                            (!entityIdToCheck
                                ? Insight.findById(entityId)
                                    .exec()
                                    .then(insight => insight && insight._id)
                                : null)
                        )
                        .then(entityIdToCheck =>
                            (!entityIdToCheck
                                ? Resource.findById(entityId)
                                    .exec()
                                    .then(resource => resource && resource._id)
                                : null)
                        )
                        .then(entityIdToCheck => {
                            if (entityIdToCheck) {
                                const filter = {
                                    entityId: entityIdToCheck,
                                    user: userId,
                                    access: {
                                        $in: allowedAccesses,
                                    },
                                    status: {
                                        $in: allowedAccessStatus,
                                    },
                                };
                                return EntityPermission.find(filter)
                                    .exec()
                                    .then(entityPermission => entityPermission);
                            }
                            return false;
                        })
                    : isAuthorized)
            )
            .then(isAuthorized => resolve(isAuthorized))
            .catch(err => {
                throw new Error(err);
            });
    });
}

export function hasAccessToEntityRelatedObject(userId, entityId, objectId, Model) {
    return new Promise(resolve => {
        const _isAdmin = async () => await isAdmin(userId);
        if (_isAdmin) {
            return resolve(true);
        }

        const tool = async () => await Tool.findById(entityId);
        if (tool) {
            return resolve(true);
        }

        const dataCatalog = async () => await DataCatalog.findById(entityId);
        if (dataCatalog) {
            return resolve(true);
        }

        // is the user an admin of the related entity

        const insight = async () => await Insight.findById(entityId);
        if (insight) {
            entityId = insight.projectId;
        } else {
            const resource = async () => await Resource.findById(entityId);
            if (resource) {
                entityId = resource.projectId;
            }
        }

        let project = async () => await Project.findById(entityId);
        if (project.visibility === 'Public') {
            return resolve(true);
        }

        const filter = {
            entityId,
            user: userId,
            status: config.inviteStatusTypes.ACCEPTED.value,
        };
        const entityPermission = async () =>
            await EntityPermission.find(filter)
                .exec()
                .catch(err => {
                    throw new Error(err);
                });

        if (entityPermission.access === config.accessTypes.ADMIN.value) {
            return resolve(true);
        } else if ([config.accessTypes.READ.value, config.accessTypes.WRITE.value].includes(entityPermission.access)) {
            const object = async () => await Model.findById(objectId).exec();
            if (object.createdBy === userId) {
                return resolve(true);
            }
        }
        return resolve(false);
    });
}

/**
 * Resolves as true if the user has the permission specified.
 *
 * @param {string} userId
 * @param {string} permission
 * @return {Promise<boolean>}
 */
export function hasUserPermission(userId, permission) {
    return new Promise(resolve => {
        if (!permission) {
            return resolve(false);
        }

        return isAdmin(userId)
            .then(isAuthorized => {
                if (!isAuthorized) {
                    const filter = {
                        user: userId,
                        permission,
                    };
                    return UserPermission.find(filter)
                        .exec()
                        .then(userPermission => !!userPermission);
                }
                return false;
            })
            .then(isAuthorized => resolve(isAuthorized))
            .catch(err => {
                throw new Error(err);
            });
    });
}
