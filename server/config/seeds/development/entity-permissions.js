import mongoose from 'mongoose';
import {
    testProjectId,
    anotherProjectId
} from './projects';
import {
    report1Id,
    report2Id
} from './reports';
import {
    adminUserId,
    testUserId,
    testUser1Id
} from './users';
import {
    accessTypes,
    entityTypes,
    inviteStatusTypes,
} from '../../environment/shared';

const entityPermissionInsightTypeId = new mongoose.Types.ObjectId('1d40f40a32464473f4f07b91');
const entityPermissionInsightType2Id = new mongoose.Types.ObjectId('22e2f70a32464473f4f07b72');

let entityPermissions = [{
    status: inviteStatusTypes.ACCEPTED.value,
    entityId: testProjectId,
    entityType: entityTypes.PROJECT.value,
    user: adminUserId,
    access: accessTypes.ADMIN.value,
    createdBy: adminUserId,
}, {
    status: inviteStatusTypes.PENDING.value,
    entityId: anotherProjectId,
    entityType: entityTypes.PROJECT.value,
    user: testUserId,
    access: accessTypes.ADMIN.value,
    createdBy: testUserId,
}, {
    _id: entityPermissionInsightType2Id,
    status: inviteStatusTypes.PENDING.value,
    entityId: anotherProjectId,
    entityType: entityTypes.PROJECT.value,
    user: adminUserId,
    access: accessTypes.READ.value,
    createdBy: testUserId,
}, {
    _id: entityPermissionInsightTypeId,
    status: inviteStatusTypes.ACCEPTED.value,
    entityId: report1Id,
    entityType: entityTypes.INSIGHT.value,
    user: testUserId,
    access: accessTypes.READ.value,
    createdBy: adminUserId,
}, {
    status: inviteStatusTypes.ACCEPTED.value,
    entityId: report1Id,
    entityType: entityTypes.INSIGHT.value,
    user: testUser1Id,
    access: accessTypes.READ.value,
    createdBy: adminUserId,
}, {
    status: inviteStatusTypes.ACCEPTED.value,
    entityId: report2Id,
    entityType: entityTypes.INSIGHT.value,
    user: testUser1Id,
    access: accessTypes.WRITE.value,
    createdBy: testUserId,
}];

export {
    entityPermissions,
    entityPermissionInsightTypeId,
    entityPermissionInsightType2Id
};
