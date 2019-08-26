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

const entityPermission1Id = new mongoose.Types.ObjectId('1d40f40a32464473f4f07b91');
const entityPermission2Id = new mongoose.Types.ObjectId('22e2f70a32464473f4f07b72');
const entityPermission3Id = new mongoose.Types.ObjectId('3d40f40a12345678f4f07b93');
const entityPermission4Id = new mongoose.Types.ObjectId('4d4a12345678f442f4f07104');
const entityPermission5Id = new mongoose.Types.ObjectId('5d4a123456ef3212f4fab105');

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
}, {
    _id: entityPermission3Id,
    status: inviteStatusTypes.ACCEPTED.value,
    entityId: report1Id,
    entityType: entityTypes.INSIGHT.value,
    user: testUserId,
    access: accessTypes.READ.value,
    createdBy: adminUserId,
}, {
    _id: entityPermission4Id,
    status: inviteStatusTypes.ACCEPTED.value,
    entityId: report1Id,
    entityType: entityTypes.INSIGHT.value,
    user: testUser1Id,
    access: accessTypes.READ.value,
    createdBy: adminUserId,
}, {
    _id: entityPermission5Id,
    status: inviteStatusTypes.ACCEPTED.value,
    entityId: report2Id,
    entityType: entityTypes.INSIGHT.value,
    user: testUser1Id,
    access: accessTypes.WRITE.value,
    createdBy: testUserId,
}];

export {
    entityPermissions,
    entityPermission1Id,
    entityPermission2Id
};
