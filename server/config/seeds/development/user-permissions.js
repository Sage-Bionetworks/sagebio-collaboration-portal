import mongoose from 'mongoose';
import {
    adminUserId,
    testUserId
} from './users';
import {
    reactivateUserPermId,
    deactivateUserPermId
} from './permissions';

let userPermissions = [{
    user: adminUserId,
    permission: reactivateUserPermId,
    createdBy: adminUserId
}, {
    user: adminUserId,
    permission: deactivateUserPermId,
    createdBy: adminUserId
}, {
    user: testUserId,
    permission: deactivateUserPermId,
    createdBy: adminUserId
}];

export {
    userPermissions
};
