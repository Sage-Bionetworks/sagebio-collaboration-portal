import { testProjectId } from './projects';
import {
    adminUserId,
    testUserId
} from './users';

let entityPermissions = [{
    status: 'pending',
    entityId: testProjectId,
    entityType: 'project',
    user: testUserId,
    access: 'read',
    createdBy: adminUserId,
}];

export {
    entityPermissions
};
