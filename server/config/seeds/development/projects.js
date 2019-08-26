import mongoose from 'mongoose';
import { adminUserId, testUserId } from './users';

const testProjectId = new mongoose.Types.ObjectId('5cb7acea2d718654d81bb97e');
const anotherProjectId = new mongoose.Types.ObjectId('5cb7acea2d718614d81db97f');

let projects = [{
    _id: testProjectId,
    title: 'Test Project',
    description: `{\"ops\":[{\"insert\":\"This is a test project.\\n\\n\"}]}`,
    visibility: 'Public',
    createdBy: adminUserId
}, {
    _id: anotherProjectId,
    title: 'Another Project',
    description: `{\"ops\":[{\"insert\":\"This is another project.\\n\\n\"}]}`,
    visibility: 'Public',
    createdBy: testUserId
}];

export {
    projects,
    testProjectId,
    anotherProjectId,
};
