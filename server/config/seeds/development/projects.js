import mongoose from 'mongoose';
import { adminUserId, testUserId } from './users';
import { entityVisibility } from '../../environment';

const adminProjectId = new mongoose.Types.ObjectId('5cb7acea2d718654d81bb97e');
const testProjectId = new mongoose.Types.ObjectId('5cb7acea2d718614d81db97f');

let projects = [{
    _id: adminProjectId,
    title: 'Admin Project',
    description: `{\"ops\":[{\"insert\":\"This is a test project.\\n\\n\"}]}`,
    visibility: entityVisibility.PUBLIC.value,
    createdBy: adminUserId
}, {
    _id: testProjectId,
    title: 'Test Project',
    description: `{\"ops\":[{\"insert\":\"This is another project.\\n\\n\"}]}`,
    visibility: entityVisibility.PRIVATE.value,
    createdBy: testUserId
}];

export {
    projects,
    adminProjectId,
    testProjectId,
};
