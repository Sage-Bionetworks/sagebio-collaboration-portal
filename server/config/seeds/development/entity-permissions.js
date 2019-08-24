import mongoose from 'mongoose';
import {
    testProjectId,
    anotherProjectId
} from './projects';
import {
    adminUserId,
    testUserId
} from './users';
import {
    accessTypes,
    entityTypes,
    inviteStatusTypes,
} from '../../environment/shared';

const entityPermission1Id = new mongoose.Types.ObjectId('5d40f40a32464473f4f07b98');
const entityPermission2Id = new mongoose.Types.ObjectId('52e2f70a32464473f4f07b79');


let entityPermissions = [{
    status: inviteStatusTypes.ACCEPTED.value,
    entityId: testProjectId,
    entityType: entityTypes.PROJECT.value,
    user: adminUserId,
    access: accessTypes.ADMIN.value,
    createdBy: adminUserId,
}, {
    _id: entityPermission1Id,
    status: inviteStatusTypes.PENDING.value,
    entityId: anotherProjectId,
    entityType: entityTypes.PROJECT.value,
    user: testUserId,
    access: accessTypes.ADMIN.value,
    createdBy: testUserId,
}, {
    _id: entityPermission2Id,
    status: inviteStatusTypes.PENDING.value,
    entityId: anotherProjectId,
    entityType: entityTypes.PROJECT.value,
    user: adminUserId,
    access: accessTypes.READ.value,
    createdBy: testUserId,
}];

export {
    entityPermissions,
    entityPermission1Id,
    entityPermission2Id
};
