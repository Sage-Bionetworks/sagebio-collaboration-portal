import mongoose from 'mongoose';
import {
    adminUserId,
    testUserId
} from './users';

// TODO: import permission values from unique definition

let userPermissions = [{
    user: adminUserId,
    permission: 'createTool',
    createdBy: adminUserId
}, {
    user: adminUserId,
    permission: 'editTool',
    createdBy: adminUserId
}, {
    user: adminUserId,
    permission: 'deleteTool',
    createdBy: adminUserId
}, {
    user: testUserId,
    permission: 'editTool',
    createdBy: adminUserId
}];

export {
    userPermissions
};
